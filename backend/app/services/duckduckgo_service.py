from ddgs import DDGS

from backend.app.services.search_service import SearchEvidence


class DuckDuckGoService:

    async def search(
        self,
        claim: str,
        limit: int = 5,
    ) -> list[SearchEvidence]:

        results: list[SearchEvidence] = []

        queries = [
            claim,
            f"{claim} official",
            f"{claim} history",
        ]

        seen_urls: set[str] = set()

        with DDGS() as ddgs:

            for query in queries:

                if len(results) >= limit:
                    break

                try:

                    search_results = ddgs.text(
                        query,
                        max_results=limit,
                    )

                    for item in search_results:

                        url = item.get("href", "") or ""
                        title = item.get("title", "") or ""
                        snippet = item.get("body", "") or ""

                        if not url:
                            continue

                        if url in seen_urls:
                            continue

                        seen_urls.add(url)

                        domain = (
                            url.replace("https://", "")
                            .replace("http://", "")
                            .split("/")[0]
                            .replace("www.", "")
                        )

                        source = (
                            domain.split(".")[0].title()
                            if domain
                            else "Unknown"
                        )

                        results.append(
                            SearchEvidence(
                                title=title,
                                source=source,
                                domain=domain,
                                url=url,
                                snippet=snippet,
                                provider="duckduckgo",
                                is_mock=False,
                            )
                        )

                        if len(results) >= limit:
                            break

                except Exception as exc:

                    print(
                        f"[DuckDuckGo] Search failed for "
                        f"'{query}': {exc}"
                    )

        print(
            f"[DuckDuckGo] Collected {len(results)} sources."
        )

        return results


duckduckgo_service = DuckDuckGoService()