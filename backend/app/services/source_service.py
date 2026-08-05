"""Source credibility classification for verification evidence."""

from urllib.parse import urlparse

from pydantic import BaseModel, Field


class SourceCredibility(BaseModel):
    source: str
    category: str
    credibility_score: int = Field(ge=0, le=100)


_SOURCE_PROFILES = {
    "nasa.gov": ("Government science agency", 98),
    "esa.int": ("Intergovernmental science agency", 96),
    "who.int": ("International public-health organization", 96),
    "nature.com": ("Peer-reviewed scientific publisher", 94),
    "science.org": ("Scientific publisher", 93),
    "reuters.com": ("International news agency", 90),
    "apnews.com": ("International news agency", 90),
    "britannica.com": ("Reference publisher", 86),
}

_SOURCE_ALIASES = {
    "nasa": "nasa.gov",
    "european space agency": "esa.int",
    "world health organization": "who.int",
    "encyclopaedia britannica": "britannica.com",
    "britannica": "britannica.com",
    "reuters": "reuters.com",
    "associated press": "apnews.com",
    "ap news": "apnews.com",
}


def _normalize_source(value: str) -> str:
    candidate = value.strip().lower()
    if not candidate:
        return ""

    if "://" in candidate:
        candidate = urlparse(candidate).netloc
    else:
        candidate = candidate.split("/")[0]

    normalized = candidate.removeprefix("www.")
    return _SOURCE_ALIASES.get(normalized, normalized)


def score_source(source: str) -> dict[str, str | int]:
    """Classify a source name, domain, or URL using a conservative local registry."""
    domain = _normalize_source(source)

    for trusted_domain, (category, score) in _SOURCE_PROFILES.items():
        if domain == trusted_domain or domain.endswith(f".{trusted_domain}"):
            return SourceCredibility(
                source=source,
                category=category,
                credibility_score=score,
            ).model_dump()

    return SourceCredibility(
        source=source,
        category="Unclassified source",
        credibility_score=50,
    ).model_dump()


class SourceService:
    """Service wrapper for future registry, reputation, and policy providers."""

    def assess(self, source: str) -> dict[str, str | int]:
        return score_source(source)
