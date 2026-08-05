import json
import os
from collections.abc import Mapping
from pathlib import Path
from typing import Any

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


async def analyze_claim(
    claim: str, evidence: Mapping[str, Any] | None = None
) -> dict[str, object]:
    """Analyze a claim with Groq and return the API's existing result fields."""
    evidence_bundle = dict(evidence or {})
    if not evidence_bundle:
        evidence_bundle = {
            "status": "unavailable",
            "evidence": [],
            "summary": "No evidence bundle was provided for this claim.",
        }

    prompt = f"""
Claim:
{claim}

Evidence collected:
{json.dumps(evidence_bundle, ensure_ascii=False)}

Instructions:
- Evaluate the claim using the provided evidence as the primary basis.
- Do not rely only on internal knowledge.
- If evidence is unavailable, incomplete, or insufficient, say so clearly and
  lower the confidence appropriately.
- Use source names from the evidence bundle when they support the explanation;
  do not invent citations.
- Return structured JSON only.
""".strip()

    response = await _get_client().chat.completions.create(
        model=GROQ_MODEL,
        temperature=0.2,
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a careful fact-checking assistant. Return only a JSON "
                    "object with verdict (exactly one of True, False, Misleading, "
                    "or Insufficient Evidence), confidence (integer 0-100), "
                    "explanation (string), and sources (array of strings). Do not "
                    "invent citations. Follow the evidence and instructions supplied "
                    "by the user message."
                ),
            },
            {"role": "user", "content": prompt},
        ],
    )

    content = response.choices[0].message.content
    if not content:
        raise RuntimeError("Groq returned no analysis content.")

    return ClaimAnalysis.model_validate(json.loads(content)).model_dump()
