"""Search abstractions for collecting verification evidence.

The default provider is intentionally deterministic and mocked. Production providers
such as Google Custom Search, Bing Web Search, or SerpAPI can implement the
``SearchProvider`` protocol without changing callers.
"""

from collections.abc import Sequence
from typing import Protocol

from pydantic import BaseModel, Field


class SearchEvidence(BaseModel):
    """A normalized result returned by any evidence-search provider."""

    title: str
    source: str
    domain: str
    url: str
    snippet: str
    provider: str
    is_mock: bool = False


class SearchProvider(Protocol):
    """Provider contract for future external search integrations."""

    async def search(self, claim: str, limit: int = 5) -> Sequence[SearchEvidence]:
        """Return normalized evidence candidates for a claim."""


class MockSearchProvider:
    """Deterministic placeholder provider for local development and service tests."""

    _RESULTS = (
        SearchEvidence(
            title="Earth Fact Sheet",
            source="NASA",
            domain="nasa.gov",
            url="https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html",
            snippet="Mock search evidence from an authoritative scientific source.",
            provider="mock",
            is_mock=True,
        ),
        SearchEvidence(
            title="Earth | Definition, Size, Composition, Temperature, Mass, & Facts",
            source="Encyclopaedia Britannica",
            domain="britannica.com",
            url="https://www.britannica.com/place/Earth",
            snippet="Mock reference evidence returned for service integration testing.",
            provider="mock",
            is_mock=True,
        ),
        SearchEvidence(
            title="Earth observation",
            source="European Space Agency",
            domain="esa.int",
            url="https://www.esa.int/Applications/Observing_the_Earth",
            snippet="Mock space-agency evidence returned for service integration testing.",
            provider="mock",
            is_mock=True,
        ),
    )

    async def search(self, claim: str, limit: int = 5) -> Sequence[SearchEvidence]:
        """Return a bounded set of normalized mock results.

        ``claim`` is deliberately accepted now so the future provider interface stays
        stable even though mock data is not yet query-specific.
        """
        del claim
        return self._RESULTS[: max(0, limit)]


class SearchService:
    """Application-facing search service with a swappable provider."""

    def __init__(self, provider: SearchProvider | None = None) -> None:
        self._provider = provider or MockSearchProvider()

    async def find_evidence(
        self, claim: str, limit: int = 5
    ) -> list[SearchEvidence]:
        normalized_claim = claim.strip()
        if not normalized_claim:
            return []

        results = await self._provider.search(normalized_claim, limit=limit)
        return list(results)


async def search_claim(claim: str, limit: int = 5) -> list[SearchEvidence]:
    """Convenience entry point for the default evidence-search service."""
    return await SearchService().find_evidence(claim, limit=limit)
