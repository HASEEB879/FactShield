from dataclasses import dataclass

import wikipediaapi


@dataclass
class WikipediaEvidence:

    title: str
    source: str
    domain: str
    snippet: str
    url: str
    provider: str
    is_mock: bool = False


class WikipediaService:

    def __init__(self):

        self.wiki = wikipediaapi.Wikipedia(
            language="en",
            user_agent="FactShieldAI/1.0"
        )

    async def search(
        self,
        query: str,
    ) -> WikipediaEvidence | None:

        # ------------------------------------------------------
        # Try the exact query first.
        # ------------------------------------------------------

        page = self.wiki.page(query)

        if page.exists():

            return WikipediaEvidence(
                title=page.title,
                source="Wikipedia",
                domain="wikipedia.org",
                snippet=page.summary[:4000],
                url=page.fullurl,
                provider="wikipedia",
                is_mock=False,
            )

        # ------------------------------------------------------
        # Try useful keyword forms when the exact question
        # is not itself a Wikipedia page title.
        # ------------------------------------------------------

        search_terms = [
            query.replace("?", ""),
            query.replace("?", "").replace("Who ", ""),
            query.replace("?", "").replace("When ", ""),
        ]

        for term in search_terms:

            term = term.strip()

            if not term:
                continue

            page = self.wiki.page(term)

            if page.exists():

                return WikipediaEvidence(
                    title=page.title,
                    source="Wikipedia",
                    domain="wikipedia.org",
                    snippet=page.summary[:4000],
                    url=page.fullurl,
                    provider="wikipedia",
                    is_mock=False,
                )

        return None


wiki_service = WikipediaService()