import json
import os
from collections.abc import Mapping
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from groq import AsyncGroq
from pydantic import BaseModel, Field


# ================================================================
# Configuration
# ================================================================

BACKEND_DIR = Path(__file__).resolve().parents[2]

load_dotenv(
    BACKEND_DIR / ".env"
)

GROQ_MODEL = "llama-3.3-70b-versatile"


# ================================================================
# AI result model
# ================================================================

class ClaimAnalysis(BaseModel):

    verdict: str = Field(
        default=""
    )

    confidence: int = Field(
        ge=0,
        le=100,
    )

    explanation: str = Field(
        default=""
    )

    sources: list[str] = Field(
        default_factory=list
    )

    answer: str = Field(
        default=""
    )

    intent: str = Field(
        default="CLAIM"
    )

    search_query: str = Field(
        default=""
    )


# ================================================================
# Confidence normalization
# ================================================================

def _normalize_confidence(
    value: Any,
) -> int:

    """
    Normalize AI confidence into an integer percentage.

    Supported formats:

        0.98  -> 98
        0.85  -> 85
        98    -> 98
        72.5  -> 73

    The AI may return confidence either as a
    probability between 0 and 1 or as a percentage
    between 0 and 100.
    """

    try:

        confidence = float(
            value
        )

    except (
        TypeError,
        ValueError,
    ):

        return 0

    # ------------------------------------------------------------
    # Probability format: 0.0 - 1.0
    # ------------------------------------------------------------

    if 0 <= confidence <= 1:

        confidence *= 100

    # ------------------------------------------------------------
    # Percentage format: 0 - 100
    # ------------------------------------------------------------

    confidence = round(
        confidence
    )

    # ------------------------------------------------------------
    # Safety bounds
    # ------------------------------------------------------------

    return max(
        0,
        min(
            100,
            int(confidence),
        ),
    )


# ================================================================
# Groq client
# ================================================================

def _get_client() -> AsyncGroq:

    api_key = os.getenv(
        "GROQ_API_KEY"
    )

    if not api_key:
        raise RuntimeError(
            "GROQ_API_KEY missing."
        )

    return AsyncGroq(
        api_key=api_key
    )


# ================================================================
# Evidence preparation
# ================================================================

def _prepare_evidence(
    evidence: Mapping[str, Any],
) -> tuple[
    list[dict[str, Any]],
    list[str],
]:

    raw_items = evidence.get(
        "evidence",
        [],
    )

    formatted: list[
        dict[str, Any]
    ] = []

    source_urls: list[str] = []

    for item in raw_items:

        if not isinstance(
            item,
            Mapping,
        ):
            continue

        # --------------------------------------------------------
        # URL
        # --------------------------------------------------------

        url = str(
            item.get(
                "url",
                "",
            )
            or ""
        ).strip()

        if url:
            source_urls.append(
                url
            )

        # --------------------------------------------------------
        # Basic metadata
        # --------------------------------------------------------

        title = str(
            item.get(
                "title",
                "",
            )
            or ""
        )

        source = str(
            item.get(
                "source",
                "",
            )
            or ""
        )

        snippet = str(
            item.get(
                "snippet",
                "",
            )
            or ""
        )

        # --------------------------------------------------------
        # Scores
        # --------------------------------------------------------

        credibility = int(
            item.get(
                "credibility_score",
                0,
            )
            or 0
        )

        search_score = float(
            item.get(
                "search_score",
                0,
            )
            or 0
        )

        relevance_score = float(
            item.get(
                "relevance_score",
                0,
            )
            or 0
        )

        final_score = float(
            item.get(
                "final_score",
                0,
            )
            or 0
        )

        # --------------------------------------------------------
        # Compact AI representation
        # --------------------------------------------------------

        formatted.append(
            {
                "title": title[:250],

                "source": source[:120],

                "credibility": credibility,

                "search_score": round(
                    search_score,
                    4,
                ),

                "relevance_score": round(
                    relevance_score,
                    4,
                ),

                "final_score": round(
                    final_score,
                    4,
                ),

                "snippet": snippet[:1000],

                "url": url,
            }
        )

    # ------------------------------------------------------------
    # Remove duplicate URLs
    # ------------------------------------------------------------

    unique_urls = list(
        dict.fromkeys(
            source_urls
        )
    )

    # ------------------------------------------------------------
    # Sort evidence by FactShield final ranking
    # ------------------------------------------------------------

    formatted.sort(
        key=lambda item: (
            item.get(
                "final_score",
                0,
            )
        ),
        reverse=True,
    )

    # ------------------------------------------------------------
    # Limit evidence sent to Groq
    # ------------------------------------------------------------

    formatted = formatted[:10]

    return (
        formatted,
        unique_urls,
    )


# ================================================================
# AI analysis
# ================================================================

async def analyze_claim(
    claim: str,
    evidence: Mapping[str, Any] | None = None,
    intent: str = "CLAIM",
    search_query: str = "",
) -> dict[str, object]:

    evidence_data = dict(
        evidence or {}
    )

    formatted_evidence, source_urls = (
        _prepare_evidence(
            evidence_data
        )
    )

    evidence_json = json.dumps(
        formatted_evidence,
        ensure_ascii=False,
        separators=(
            ",",
            ":",
        ),
    )

    # ============================================================
    # QUESTION / RANKING MODE
    # ============================================================

    if intent in {
        "QUESTION",
        "RANKING",
    }:

        prompt = f"""
You are FactShield AI, a professional
evidence-grounded factual research engine.

USER QUESTION:
{claim}

OPTIMIZED SEARCH QUERY:
{search_query}

RANKED EVIDENCE:
{evidence_json}

Your job is to answer the user's actual question.

IMPORTANT EVIDENCE RULES:

1. Use ONLY the supplied evidence.

2. Never invent facts, names, dates, numbers,
organizations, rankings, or URLs.

3. FactShield has already ranked the evidence.

4. The `final_score` represents the overall evidence
quality and should be treated as the primary ranking
signal.

5. `final_score` combines:
   - search relevance
   - source credibility
   - textual relevance

6. Prefer higher `final_score` sources.

7. When two sources have similar final scores,
prefer the more authoritative or primary source.

8. Government agencies, official organizations,
primary documents, and authoritative institutions
should generally be preferred over user-generated
content.

9. Do NOT treat a high credibility score alone as proof
that the source answers the question.

10. The source must actually contain evidence relevant
to the user's question.

11. Multiple independent sources agreeing on the same
fact increase confidence.

12. If strong evidence gives a clear answer,
ANSWER THE QUESTION directly.

13. Do NOT unnecessarily return
"Insufficient Evidence".

14. If exact information cannot be established,
give the best-supported answer and clearly explain
the uncertainty.

15. Keep the answer concise and factual.

16. Explain the most important supporting evidence.

17. Return only URLs that appear in the supplied evidence.

18. Never create a URL yourself.

19. Return confidence as a probability between 0 and 1.
For example, 0.98 means 98% confidence.

Return JSON only:

{{
    "verdict": "Answered",
    "confidence": 0.0,
    "answer": "",
    "explanation": "",
    "sources": []
}}
"""

    # ============================================================
    # CLAIM VERIFICATION MODE
    # ============================================================

    else:

        prompt = f"""
You are FactShield AI, a professional
fact-verification engine.

USER CLAIM:
{claim}

RANKED EVIDENCE:
{evidence_json}

Your job is to determine whether the claim is
supported by the supplied evidence.

IMPORTANT RULES:

1. Use ONLY the supplied evidence.

2. Never invent evidence.

3. Never invent sources.

4. Never invent URLs.

5. FactShield has already ranked the evidence.

6. Treat `final_score` as the primary evidence-ranking
signal.

7. Prefer higher final_score evidence.

8. Prefer authoritative and primary sources when their
relevance is comparable.

9. A high credibility score does NOT automatically mean
the source proves the claim.

10. The evidence must actually support or contradict
the claim.

11. Multiple independent sources agreeing on the same
fact can collectively establish the claim.

12. If strong evidence supports the claim:
verdict = "True"

13. If strong evidence contradicts the claim:
verdict = "False"

14. If the claim contains a mixture of true and false
information, or the evidence materially qualifies it:
verdict = "Misleading"

15. Use "Insufficient Evidence" ONLY when the supplied
evidence genuinely cannot establish whether the claim
is true or false.

16. Do NOT use "Insufficient Evidence" merely because
there is no single perfect source.

17. Confidence must reflect the strength, consistency,
and quality of the evidence.

18. Return confidence as a probability between 0 and 1.
For example, 0.98 means 98% confidence.

19. Explain the decisive evidence briefly.

20. Return only URLs that appear in the supplied evidence.

21. Never create a URL yourself.

Return JSON only:

{{
    "verdict": "",
    "confidence": 0.0,
    "answer": "",
    "explanation": "",
    "sources": []
}}
"""

    # ============================================================
    # Groq request
    # ============================================================

    response = await _get_client().chat.completions.create(

        model=GROQ_MODEL,

        temperature=0,

        max_tokens=900,

        response_format={
            "type": "json_object"
        },

        messages=[
            {
                "role": "system",
                "content": (
                    "You are FactShield, an "
                    "evidence-grounded factual "
                    "research and verification engine. "
                    "Use only supplied evidence. "
                    "Return valid JSON only."
                ),
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
    )

    # ============================================================
    # Parse response
    # ============================================================

    content = (
        response
        .choices[0]
        .message
        .content
    )

    if not content:
        raise RuntimeError(
            "Empty response from Groq."
        )

    try:

        data = json.loads(
            content
        )

    except json.JSONDecodeError as exc:

        raise RuntimeError(
            "Groq returned invalid JSON."
        ) from exc

    # ============================================================
    # Normalize confidence
    # ============================================================

    data["confidence"] = (
        _normalize_confidence(
            data.get(
                "confidence",
                0,
            )
        )
    )

    # ============================================================
    # Validate returned sources
    # ============================================================

    returned_sources = data.get(
        "sources"
    )

    if not isinstance(
        returned_sources,
        list,
    ):

        returned_sources = []

    valid_sources = [

        url

        for url in returned_sources

        if isinstance(
            url,
            str,
        )
        and url in source_urls
    ]

    # Always preserve evidence URLs.
    data["sources"] = (
        valid_sources
        or source_urls
    )

    # ============================================================
    # Preserve pipeline metadata
    # ============================================================

    data["intent"] = intent

    data["search_query"] = (
        search_query
    )

    # ============================================================
    # Validate final response
    # ============================================================

    return (
        ClaimAnalysis
        .model_validate(
            data
        )
        .model_dump()
    )