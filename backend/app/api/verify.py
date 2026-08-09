from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.services.verify_service import verify_claim


router = APIRouter(
    tags=["Verification"]
)


# ================================================================
# Request model
# ================================================================

class VerifyRequest(BaseModel):

    claim: str = Field(
        min_length=1,
        max_length=5000,
        description="Claim or question to verify."
    )


# ================================================================
# Response model
# ================================================================

class VerifyResponse(BaseModel):

    claim: str

    verdict: str

    confidence: int = Field(
        ge=0,
        le=100,
    )

    explanation: str

    answer: str

    sources: list[str]

    intent: str

    search_query: str


# ================================================================
# Verify endpoint
# ================================================================

@router.post(
    "/verify",
    response_model=VerifyResponse,
)
async def verify(
    request: VerifyRequest,
):

    claim = request.claim.strip()

    if not claim:

        raise HTTPException(
            status_code=400,
            detail="Claim cannot be empty.",
        )

    try:

        result = await verify_claim(
            claim
        )

        return VerifyResponse(
            claim=str(
                result.get(
                    "claim",
                    claim,
                )
            ),

            verdict=str(
                result.get(
                    "verdict",
                    "",
                )
            ),

            confidence=int(
                result.get(
                    "confidence",
                    0,
                )
                or 0
            ),

            explanation=str(
                result.get(
                    "explanation",
                    "",
                )
                or ""
            ),

            answer=str(
                result.get(
                    "answer",
                    "",
                )
                or ""
            ),

            sources=list(
                result.get(
                    "sources",
                    [],
                )
                or []
            ),

            intent=str(
                result.get(
                    "intent",
                    "CLAIM",
                )
            ),

            search_query=str(
                result.get(
                    "search_query",
                    claim,
                )
            ),
        )

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    except Exception as exc:

        print(
            f"[Verification API] Error: {exc}"
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "FactShield verification "
                "failed."
            ),
        ) from exc