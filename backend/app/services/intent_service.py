import json
import os
from pathlib import Path

from dotenv import load_dotenv
from groq import AsyncGroq
from pydantic import BaseModel, Field


BACKEND_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BACKEND_DIR / ".env")

GROQ_MODEL = "llama-3.3-70b-versatile"


class QueryIntent(BaseModel):
    intent: str = Field(
        description="Either CLAIM, QUESTION, or RANKING"
    )

    search_query: str

    reasoning: str


def _get_client() -> AsyncGroq:

    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        raise RuntimeError("GROQ_API_KEY missing")

    return AsyncGroq(api_key=api_key)


async def analyze_query_intent(
    query: str,
) -> dict[str, object]:

    query = query.strip()

    if not query:
        raise ValueError("Query cannot be empty")

    prompt = f"""
You are the query-intent engine for FactShield.

Your job is to classify the user's request and create
a HIGH-QUALITY factual web-search query.

USER INPUT:

{query}


============================================================
INTENT CLASSIFICATION
============================================================

Choose exactly ONE:

CLAIM

The user states something that can be verified as true,
false, or misleading.

Examples:

"The Earth is flat."

"Pakistan has 5 provinces."


QUESTION

The user asks for factual information.

Examples:

"Who invented the telephone?"

"Who founded NASA?"

"What is the capital of Pakistan?"

"How far is Rawalpindi from Lahore?"


RANKING

The user asks for a ranking, largest/smallest comparison,
or comparison between entities.

Examples:

"Which is the largest university in Pakistan?"

"Biggest university in Rawalpindi by area?"

"Which is the fastest car?"


============================================================
SEARCH QUERY GENERATION
============================================================

The search query is extremely important.

It must search for the ACTUAL FACT needed to answer
the user's request.

Do NOT merely repeat the user's sentence.

For WHO questions:

Include:
- the entity
- founder / established / created / introduced /
  inventor / creator terminology as appropriate
- historical context when useful
- authoritative/official terminology when appropriate

Example:

User:
"Who founded NASA?"

Good:
"NASA founded established who official history"

Better:
"NASA establishment founder National Aeronautics and Space Act 1958 official"

For questions asking when something happened:

Include the event and the date/history terminology.

For questions asking where:

Include the entity and location terminology.

For questions asking who:

Search specifically for the person or people responsible.

For questions asking how something was established:

Search for establishment/history/official documentation.

For rankings:

Preserve the exact ranking criterion.

Example:

"Biggest university in Rawalpindi by area"

Good:
"largest university campus area Rawalpindi Pakistan official"

IMPORTANT:

Do not add unrelated facts.

Do not answer the question.

Do not invent names.

Do not assume the answer.

The query should maximize the chance of finding
PRIMARY or AUTHORITATIVE evidence.


============================================================
SPECIAL RULE FOR HISTORICAL / FOUNDER QUESTIONS
============================================================

When the question asks who founded, established, created,
invented, or started an organization:

Search for:

1. official history
2. establishment documents
3. founding legislation
4. government sources
5. institutional history
6. authoritative historical references

Do not search only for a famous person associated with
the organization.


============================================================
EXAMPLES
============================================================

Input:
"Who invented Python?"

Search:
"Python programming language creator Guido van Rossum official history"


Input:
"Who founded NASA?"

Search:
"NASA establishment founder National Aeronautics and Space Act 1958 official history"


Input:
"When was NASA founded?"

Search:
"NASA established 1958 official history"


Input:
"Pakistan has 5 provinces."

Search:
"Pakistan number of provinces official government"


Input:
"Biggest university in Rawalpindi by area?"

Search:
"largest university campus area Rawalpindi Pakistan official"


============================================================
RETURN
============================================================

Return ONLY valid JSON.

{{
    "intent": "QUESTION",
    "search_query": "",
    "reasoning": ""
}}
"""

    response = await _get_client().chat.completions.create(

        model=GROQ_MODEL,

        temperature=0,

        response_format={
            "type": "json_object"
        },

        messages=[
            {
                "role": "system",
                "content": "Return only valid JSON.",
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
    )

    content = response.choices[0].message.content

    if not content:
        raise RuntimeError(
            "Empty intent response"
        )

    data = json.loads(content)

    result = QueryIntent.model_validate(data)

    return result.model_dump()