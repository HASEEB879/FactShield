from fastapi import APIRouter
from pydantic import BaseModel

from app.services.verify_service import verify_claim


router = APIRouter(tags=["Verification"])


class VerifyRequest(BaseModel):
    claim: str


@router.post("/verify")
async def verify(request: VerifyRequest):

    result = await verify_claim(request.claim)

    return result