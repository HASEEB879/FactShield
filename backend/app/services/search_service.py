"""Professional live search service using Tavily."""

import os
from collections.abc import Sequence
from pathlib import Path
from typing import Protocol
from urllib.parse import urlparse

from dotenv import load_dotenv
from pydantic import BaseModel
from tavily import TavilyClient

BACKEND_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BACKEND_DIR / ".env")


class SearchEvidence(BaseModel):
    title: str
    source: str
    domain: str
    url: str
    snippet: str
    raw_content: str | None = None
    score: float = 0
    provider: str
    is_mock: bool = False


class SearchProvider(Protocol):
    async def search(
        self,
        claim: str,
        limit: int = 15,
    ) -> Sequence[SearchEvidence]:
        ...


class TavilyProvider:

    def __init__(self):

        api_key = os.getenv("TAVILY_API_KEY")

        if not api_key:
            raise RuntimeError(
                "TAVILY_API_KEY missing."
            )

        self.client = TavilyClient(api_key=api_key)

    async def search(
        self,
        claim: str,
        limit: int = 15,
    ) -> Sequence[SearchEvidence]:

        print("\n" + "=" * 80)
        print("FACTSHIELD ADVANCED SEARCH")
        print("=" * 80)
        print("Claim:", claim)
        print()

        response = self.client.search(
            query=claim,

            search_depth="advanced",

            topic="general",

            max_results=limit,

            include_answer=True,

            include_images=False,

            include_raw_content=True,
        )

        results = []

        for item in response.get("results", []):

            url = item.get("url", "")

            title = item.get("title", "")

            snippet = item.get("content", "")

            raw = item.get("raw_content", "")

            score = float(item.get("score", 0))

            domain = urlparse(url).netloc.replace("www.", "")

            source = domain.split(".")[0].title()

            print("----------------------------------------")
            print("TITLE :", title)
            print("DOMAIN:", domain)
            print("SCORE :", score)
            print()

            results.append(
                SearchEvidence(
                    title=title,
                    source=source,
                    domain=domain,
                    url=url,
                    snippet=snippet,
                    raw_content=raw,
                    score=score,
                    provider="tavily",
                    is_mock=False,
                )
            )

        results.sort(
            key=lambda x: x.score,
            reverse=True,
        )

        print(f"\nEvidence collected: {len(results)}")

        return results


class SearchService:

    def __init__(self):
        self.provider = TavilyProvider()

    async def find_evidence(
        self,
        claim: str,
        limit: int = 15,
    ) -> list[SearchEvidence]:

        claim = claim.strip()

        if not claim:
            return []

        return list(
            await self.provider.search(
                claim,
                limit,
            )
        )


async def search_claim(
    claim: str,
    limit: int = 15,
) -> list[SearchEvidence]:

    return await SearchService().find_evidence(
        claim,
        limit,
    )