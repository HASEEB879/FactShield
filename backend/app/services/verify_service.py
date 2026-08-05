from typing import Any

from app.services.ai_service import analyze_claim
from app.services.evidence_service import prepare_evidence_summary
from app.services.search_service import search_claim


async def _collect_evidence(claim: str) -> dict[str, Any]:
    """Collect evidence without blocking verification when a provider is unavailable."""
    try:
        sources = await search_claim(claim)
        evidence_summary = await prepare_evidence_summary(claim, sources)
        return {
            "status": "available",
            **evidence_summary.model_dump(),
        }
    except Exception:
        return {
            "status": "unavailable",
            "claim": claim,
            "evidence_count": 0,
            "average_credibility_score": 0.0,
            "evidence": [],
            "summary": (
                "Evidence collection was unavailable. Complete verification using "
                "only the limitations stated in the response."
            ),
        }


async def verify_claim(claim: str) -> dict[str, object]:
    evidence = await _collect_evidence(claim)

    result = await analyze_claim(claim, evidence=evidence)

    return {
        "claim": claim,
        **result
    }
