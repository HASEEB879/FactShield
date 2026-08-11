"""Evidence aggregation, scoring, and ranking for FactShield."""

from collections.abc import Mapping, Sequence
from typing import Any

from pydantic import BaseModel, Field

from backend.app.services.search_service import SearchEvidence
from backend.app.services.source_service import score_source


class EvidenceItem(BaseModel):

    source: str

    category: str

    credibility_score: int = Field(
        ge=0,
        le=100,
    )

    title: str | None = None

    url: str | None = None

    snippet: str | None = None

    raw_content: str | None = None

    search_score: float = 0.0

    relevance_score: float = 0.0

    final_score: float = 0.0

    provider: str | None = None

    is_mock: bool = False


class EvidenceSummary(BaseModel):

    claim: str

    evidence_count: int

    average_credibility_score: float

    evidence: list[EvidenceItem]

    summary: str


def _as_mapping(
    source: SearchEvidence | Mapping[str, Any] | str,
) -> Mapping[str, Any]:

    if isinstance(source, SearchEvidence):

        return source.model_dump()

    if isinstance(source, str):

        return {
            "source": source,
        }

    return source


def _text_relevance(
    claim: str,
    title: str,
    snippet: str,
) -> float:
    """
    Estimate how directly an evidence item matches the query.

    This is deliberately deterministic. It does not replace
    semantic AI reasoning; it provides an additional ranking signal.
    """

    query_words = {
        word.lower().strip(".,?!:;()[]{}\"'")
        for word in claim.split()
        if len(word.strip(".,?!:;()[]{}\"'")) >= 3
    }

    if not query_words:
        return 0.0

    evidence_text = (
        f"{title} {snippet}"
    ).lower()

    matched = sum(
        1
        for word in query_words
        if word in evidence_text
    )

    return round(
        matched / len(query_words),
        4,
    )


def _calculate_final_score(
    search_score: float,
    credibility_score: int,
    relevance_score: float,
) -> float:
    """
    Combine independent evidence-quality signals.

    Weights:
    - 45% search relevance
    - 35% source credibility
    - 20% textual query relevance
    """

    search_component = max(
        0.0,
        min(
            search_score,
            1.0,
        ),
    )

    credibility_component = (
        max(
            0.0,
            min(
                credibility_score,
                100,
            ),
        )
        / 100
    )

    relevance_component = max(
        0.0,
        min(
            relevance_score,
            1.0,
        ),
    )

    final_score = (
        search_component * 0.45
        + credibility_component * 0.35
        + relevance_component * 0.20
    )

    return round(
        final_score,
        4,
    )


class EvidenceService:

    """Normalize, score, and rank evidence."""

    async def summarize(
        self,
        claim: str,
        sources: Sequence[
            SearchEvidence
            | Mapping[str, Any]
            | str
        ],
    ) -> EvidenceSummary:

        evidence: list[EvidenceItem] = []

        for source in sources:

            raw_source = _as_mapping(
                source
            )

            source_name = str(
                raw_source.get("source")
                or raw_source.get("domain")
                or "Unknown"
            )

            domain = str(
                raw_source.get("domain")
                or source_name
            )

            credibility = score_source(
                domain
            )

            raw_content = raw_source.get(
                "raw_content"
            )

            if raw_content:

                raw_content = str(
                    raw_content
                )[:6000]

            title = str(
                raw_source.get(
                    "title",
                    "",
                )
                or ""
            )

            snippet = str(
                raw_source.get(
                    "snippet",
                    "",
                )
                or ""
            )

            search_score = float(
                raw_source.get(
                    "score",
                    0,
                )
                or 0
            )

            relevance_score = (
                _text_relevance(
                    claim,
                    title,
                    snippet,
                )
            )

            final_score = (
                _calculate_final_score(
                    search_score,
                    int(
                        credibility[
                            "credibility_score"
                        ]
                    ),
                    relevance_score,
                )
            )

            evidence.append(
                EvidenceItem(

                    source=source_name,

                    category=str(
                        credibility[
                            "category"
                        ]
                    ),

                    credibility_score=int(
                        credibility[
                            "credibility_score"
                        ]
                    ),

                    title=title,

                    url=raw_source.get(
                        "url"
                    ),

                    snippet=snippet,

                    raw_content=raw_content,

                    search_score=search_score,

                    relevance_score=relevance_score,

                    final_score=final_score,

                    provider=raw_source.get(
                        "provider"
                    ),

                    is_mock=bool(
                        raw_source.get(
                            "is_mock",
                            False,
                        )
                    ),
                )
            )

        # --------------------------------------------------------
        # Rank strongest evidence first
        # --------------------------------------------------------

        evidence.sort(
            key=lambda item: (
                item.final_score,
                item.credibility_score,
                item.search_score,
            ),
            reverse=True,
        )

        average = (

            round(
                sum(
                    item.credibility_score
                    for item in evidence
                )
                / len(evidence),
                1,
            )

            if evidence

            else 0.0
        )

        summary = (
            f"Prepared {len(evidence)} "
            "evidence item(s). Evidence was ranked "
            "using search relevance, source credibility, "
            "and textual query relevance."
        )

        return EvidenceSummary(

            claim=claim,

            evidence_count=len(
                evidence
            ),

            average_credibility_score=average,

            evidence=evidence,

            summary=summary,
        )


async def prepare_evidence_summary(
    claim: str,
    sources: Sequence[
        SearchEvidence
        | Mapping[str, Any]
        | str
    ],
) -> EvidenceSummary:

    return await EvidenceService().summarize(
        claim,
        sources,
    )