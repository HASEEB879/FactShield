from typing import Any

from app.services.ai_service import analyze_claim
from app.services.duckduckgo_service import duckduckgo_service
from app.services.evidence_service import prepare_evidence_summary
from app.services.intent_service import analyze_query_intent
from app.services.search_service import search_claim
from app.services.wikipedia_service import wiki_service


MAX_AI_EVIDENCE = 8


def _source_score(source: Any) -> tuple[float, float]:
    """
    Rank evidence using:
    1. Source credibility
    2. Search relevance score

    Higher values are better.
    """

    credibility = getattr(
        source,
        "credibility_score",
        0,
    )

    search_score = getattr(
        source,
        "score",
        0,
    )

    try:
        credibility = float(credibility or 0)
    except (TypeError, ValueError):
        credibility = 0.0

    try:
        search_score = float(search_score or 0)
    except (TypeError, ValueError):
        search_score = 0.0

    return credibility, search_score


def _select_best_sources(
    sources: list[Any],
    limit: int = MAX_AI_EVIDENCE,
) -> list[Any]:
    """
    Select a compact evidence set for the AI.

    The full search result set can be large. Only the strongest
    evidence should be passed to the language model.
    """

    if not sources:
        return []

    ranked = sorted(
        sources,
        key=_source_score,
        reverse=True,
    )

    return ranked[:limit]


async def _collect_evidence(
    search_query: str,
) -> dict[str, Any]:
    """
    Collect evidence from all available search providers.

    Providers:
    - Tavily
    - DuckDuckGo
    - Wikipedia

    Evidence is deduplicated before credibility scoring.
    """

    evidence_sources: list[Any] = []

    # ============================================================
    # 1. Tavily
    # ============================================================

    try:
        tavily_results = await search_claim(
            search_query,
            limit=10,
        )

        evidence_sources.extend(tavily_results)

        print(
            f"[Tavily] Collected {len(tavily_results)} sources."
        )

    except Exception as exc:
        print(
            f"[Tavily] Evidence collection failed: {exc}"
        )

    # ============================================================
    # 2. DuckDuckGo
    # ============================================================

    try:
        ddg_results = await duckduckgo_service.search(
            search_query,
            limit=7,
        )

        evidence_sources.extend(ddg_results)

        print(
            f"[DuckDuckGo] Collected {len(ddg_results)} sources."
        )

    except Exception as exc:
        print(
            f"[DuckDuckGo] Evidence collection failed: {exc}"
        )

    # ============================================================
    # 3. Wikipedia
    # ============================================================

    try:
        wiki_result = await wiki_service.search(
            search_query
        )

        if wiki_result:
            evidence_sources.append(
                wiki_result
            )

            print(
                "[Wikipedia] Evidence collected."
            )

    except Exception as exc:
        print(
            f"[Wikipedia] Evidence collection failed: {exc}"
        )

    # ============================================================
    # 4. Remove duplicate URLs
    # ============================================================

    unique_sources: list[Any] = []
    seen_urls: set[str] = set()

    for source in evidence_sources:

        url = getattr(
            source,
            "url",
            None,
        )

        if url:

            normalized_url = (
                str(url)
                .rstrip("/")
                .lower()
            )

            if normalized_url in seen_urls:
                continue

            seen_urls.add(
                normalized_url
            )

        unique_sources.append(
            source
        )

    print(
        f"[Evidence] Unique sources: "
        f"{len(unique_sources)}"
    )

    # ============================================================
    # 5. No evidence
    # ============================================================

    if not unique_sources:

        return {
            "status": "unavailable",
            "claim": search_query,
            "evidence_count": 0,
            "average_credibility_score": 0.0,
            "evidence": [],
            "summary": (
                "No usable evidence was returned by "
                "the available search providers."
            ),
        }

    # ============================================================
    # 6. Score ALL evidence
    # ============================================================

    evidence_summary = await prepare_evidence_summary(
        search_query,
        unique_sources,
    )

    evidence_data = evidence_summary.model_dump()

    # ============================================================
    # 7. Select compact AI evidence
    # ============================================================

    best_sources = _select_best_sources(
        unique_sources,
        MAX_AI_EVIDENCE,
    )

    # Create a second evidence summary containing only the
    # strongest sources that will be sent to the AI.

    best_summary = await prepare_evidence_summary(
        search_query,
        best_sources,
    )

    best_data = best_summary.model_dump()

    print(
        f"[Evidence] Selected "
        f"{len(best_data['evidence'])} best sources "
        f"for AI analysis."
    )

    print(
        "[Evidence] AI sources:"
    )

    for item in best_data["evidence"]:
        print(
            " -",
            item.get("source"),
            "|",
            item.get("title"),
            "| credibility=",
            item.get("credibility_score"),
        )

    # ============================================================
    # 8. Return compact evidence to AI
    # ============================================================

    return {
        "status": "available",

        # Full evidence statistics remain available.
        "evidence_count": evidence_data[
            "evidence_count"
        ],

        "average_credibility_score": (
            evidence_data[
                "average_credibility_score"
            ]
        ),

        # Only the strongest evidence is sent to Groq.
        "evidence": best_data[
            "evidence"
        ],

        "summary": (
            f"Collected {evidence_data['evidence_count']} "
            f"unique sources and selected "
            f"{len(best_data['evidence'])} "
            f"high-quality sources for AI analysis."
        ),
    }


async def verify_claim(
    claim: str,
) -> dict[str, object]:
    """
    Main FactShield verification pipeline.

    Pipeline:

    1. Detect user intent.
    2. Generate optimized search query.
    3. Search multiple providers.
    4. Remove duplicate sources.
    5. Score evidence.
    6. Select strongest evidence.
    7. Send compact evidence to Groq.
    8. Return final answer.
    """

    claim = claim.strip()

    if not claim:
        raise ValueError(
            "Claim cannot be empty."
        )

    # ============================================================
    # STEP 1 — Understand user request
    # ============================================================

    intent_result = await analyze_query_intent(
        claim
    )

    intent = str(
        intent_result.get(
            "intent",
            "CLAIM",
        )
    ).upper()

    search_query = str(
        intent_result.get(
            "search_query",
            claim,
        )
    ).strip()

    if not search_query:
        search_query = claim

    print("\n" + "=" * 80)
    print("FACTSHIELD QUERY ANALYSIS")
    print("=" * 80)
    print("User input :", claim)
    print("Intent     :", intent)
    print("Search     :", search_query)
    print("=" * 80)

    # ============================================================
    # STEP 2 — Collect evidence
    # ============================================================

    evidence = await _collect_evidence(
        search_query
    )

    # Preserve the original question.
    evidence["user_query"] = claim

    # ============================================================
    # STEP 3 — AI analysis
    # ============================================================

    result = await analyze_claim(
        claim,
        evidence=evidence,
        intent=intent,
        search_query=search_query,
    )

    # ============================================================
    # STEP 4 — Final response
    # ============================================================

    return {
        "claim": claim,
        **result,
    }