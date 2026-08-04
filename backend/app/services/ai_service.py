import json
import os
from pathlib import Path

from dotenv import load_dotenv
from groq import AsyncGroq
from pydantic import BaseModel, Field


# `ai_service.py` lives at backend/app/services/, so this resolves to backend/.env.
BACKEND_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BACKEND_DIR / ".env")

GROQ_MODEL = "llama-3.3-70b-versatile"


class ClaimAnalysis(BaseModel):
    verdict: str = Field(description="The fact-checking verdict for the claim.")
    confidence: int = Field(
        ge=0,
        le=100,
        description="Confidence in the verdict, from 0 to 100.",
    )
    explanation: str = Field(description="A concise evidence-based explanation.")
    sources: list[str] = Field(
        description="Authoritative sources supporting the analysis."
    )


def _get_client() -> AsyncGroq:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError(
            "GROQ_API_KEY is not set. Add it to backend/.env before verifying claims."
        )

    return AsyncGroq(api_key=api_key)


async def analyze_claim(claim: str) -> dict[str, object]:
    """Analyze a claim with Groq and return the API's existing result fields."""
    response = await _get_client().chat.completions.create(
        model=GROQ_MODEL,
        temperature=0.2,
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a careful fact-checking assistant. Return only a JSON "
                    "object with verdict (string), confidence (integer 0-100), "
                    "explanation (string), and sources (array of strings). Do not "
                    "invent citations. If evidence is uncertain or insufficient, say "
                    "so clearly and lower the confidence."
                ),
            },
            {"role": "user", "content": f"Analyze this claim: {claim}"},
        ],
    )

    content = response.choices[0].message.content
    if not content:
        raise RuntimeError("Groq returned no analysis content.")

    return ClaimAnalysis.model_validate(json.loads(content)).model_dump()
