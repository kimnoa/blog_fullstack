
from crawl4ai import *
from crawl4ai.deep_crawling import BFSDeepCrawlStrategy
from crawl4ai.content_scraping_strategy import LXMLWebScrapingStrategy

class CrawlAgent:
    async def deepCrawling(url: str) -> any:
        config = CrawlerRunConfig(
            deep_crawl_strategy=BFSDeepCrawlStrategy(
                max_depth=2,
                max_pages=20,
                include_external=False
            ),
            scraping_strategy=LXMLWebScrapingStrategy(),
            verbose=True
        )

        async with AsyncWebCrawler() as crawler:
            results = await crawler.arun(
                url=url,
                config=config
            )

            print(f"{len(results)} pages are crawled")

            return results


    async def crawler_agent(urlText:str):

        crawler_config = CrawlerRunConfig()
        brower_config = BrowserConfig(verbose=True)
        print("check")

        async with AsyncWebCrawler(config=brower_config) as crawler:

            print("check!")
            
            result : CrawlResult = await crawler.arun(
                url=urlText,
                config=crawler_config,
            )

            print("check!!")
            
            if not result.success:
                print(f"Failed : {result.error_message}")

            print("\n\n\n\n#######################################")
            print("[Clean Html]")
            print(result.cleaned_html)

            print("\n\n\n\n#######################################")
            print("[Markdown]")
            if result.markdown:
                md_res = result.markdown
                print("Raw MD:", md_res.raw_markdown[:300])
                print("Citations MD:", md_res.markdown_with_citations[:300])
                print("References:", md_res.references_markdown)
                if md_res.fit_markdown:
                    print("Pruned text:", md_res.fit_markdown[:300])

            # images = result.media.get("images", [])
            # for img in images:
            #     if img.get("score", 0) > 5:
            #         print("High-value image:", img["src"])

            # for link in result.links["internal"]:
            #     print(
            #         f"Internal link to {link['href']}"
            #         f" with text {link['text']}"
            #         )
