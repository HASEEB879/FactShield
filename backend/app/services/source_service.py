"""Source credibility classification for FactShield."""

from urllib.parse import urlparse

from pydantic import BaseModel, Field


class SourceCredibility(BaseModel):
    source: str
    category: str
    credibility_score: int = Field(ge=0, le=100)


_SOURCE_PROFILES = {
    # Government / official agencies
    "nasa.gov": ("Government science agency", 98),
    "eisenhowerlibrary.gov": ("U.S. government presidential library", 97),
    "noaa.gov": ("U.S. government science agency", 98),
    "usgs.gov": ("U.S. government science agency", 98),
    "cdc.gov": ("U.S. government public-health agency", 98),
    "nih.gov": ("U.S. government medical research agency", 98),
    "senate.gov": ("U.S. government legislative source", 97),
    "congress.gov": ("U.S. government legislative source", 97),
    "archives.gov": ("U.S. government archival source", 97),
    "whitehouse.gov": ("U.S. government official source", 97),
    "loc.gov": ("U.S. government library and archival source", 96),
    "who.int": ("International public-health organization", 96),

    # Space / scientific organizations
    "esa.int": ("Intergovernmental space agency", 96),
    "jaxa.jp": ("Government space agency", 96),
    "royalsociety.org": ("Scientific institution", 95),

    # Scientific publishers / databases
    "nature.com": ("Peer-reviewed scientific publisher", 94),
    "science.org": ("Scientific publisher", 93),
    "sciencedirect.com": ("Scientific research publisher", 92),
    "springer.com": ("Scientific research publisher", 91),
    "pubmed.ncbi.nlm.nih.gov": ("Biomedical research database", 94),

    # Major journalism
    "reuters.com": ("International news agency", 90),
    "apnews.com": ("International news agency", 90),
    "bbc.com": ("International news organization", 88),
    "bbc.co.uk": ("International news organization", 88),

    # Reference sources
    "britannica.com": ("Reference publisher", 86),
    "history.com": ("Historical reference publisher", 82),
    "wikipedia.org": ("Collaborative encyclopedia", 72),

    # Educational / general reference
    "study.com": ("Educational content publisher", 65),
    "worldatlas.com": ("General reference publisher", 60),

    # User-generated / weak evidence
    "quora.com": ("User-generated discussion platform", 25),
    "answers.com": ("User-generated reference platform", 25),
    "prezi.com": ("User-generated presentation platform", 30),
    "youtube.com": ("User-generated video platform", 30),
}


_SOURCE_ALIASES = {
    "nasa": "nasa.gov",
    "national aeronautics and space administration": "nasa.gov",

    "european space agency": "esa.int",
    "esa": "esa.int",

    "japan aerospace exploration agency": "jaxa.jp",
    "jaxa": "jaxa.jp",

    "world health organization": "who.int",

    "encyclopaedia britannica": "britannica.com",
    "britannica": "britannica.com",

    "reuters": "reuters.com",
    "associated press": "apnews.com",
    "ap news": "apnews.com",

    "bbc": "bbc.com",

    "wikipedia": "wikipedia.org",

    "youtube": "youtube.com",
    "quora": "quora.com",
    "answers": "answers.com",
    "prezi": "prezi.com",
    "worldatlas": "worldatlas.com",
    "study": "study.com",
}


def _normalize_source(value: str) -> str:
    candidate = value.strip().lower()

    if not candidate:
        return ""

    if "://" in candidate:
        candidate = urlparse(candidate).netloc
    else:
        candidate = (
            candidate
            .split("/")[0]
            .split("?")[0]
            .split("#")[0]
        )

    normalized = candidate.removeprefix("www.")

    return _SOURCE_ALIASES.get(
        normalized,
        normalized,
    )


def score_source(source: str) -> dict[str, str | int]:
    """Classify a source name, domain, or URL."""

    domain = _normalize_source(source)

    for trusted_domain, (category, score) in _SOURCE_PROFILES.items():
        if (
            domain == trusted_domain
            or domain.endswith(f".{trusted_domain}")
        ):
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
    """Service wrapper for source credibility classification."""

    def assess(
        self,
        source: str,
    ) -> dict[str, str | int]:
        return score_source(source)