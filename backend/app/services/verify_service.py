from app.services.ai_service import analyze_claim


async def verify_claim(claim: str):

    result = await analyze_claim(claim)

    return {
        "claim": claim,
        **result
    }