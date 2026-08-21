
from crawl4ai import *
from crawl4ai.deep_crawling import *
from crawl4ai.content_scraping_strategy import LXMLWebScrapingStrategy
from crawl4ai.deep_crawling.scorers import KeywordRelevanceScorer
from typing import *
from crawl4ai.async_crawler_strategy import AsyncPlaywrightCrawlerStrategy

class CrawlAgent:
    async def deepCrawling(url: str, keywordList: List[str])->List[Any|CrawlResult]:

        scorer = KeywordRelevanceScorer(
            keywords= keywordList,
            weight = 0.5
        )

        config = CrawlerRunConfig(
            deep_crawl_strategy=BestFirstCrawlingStrategy(
                max_depth=2,
                max_pages=20,
                include_external=False,
                # score_threshold=0.3,
                url_scorer=scorer,
                
            ),
            scraping_strategy=LXMLWebScrapingStrategy(),
            verbose=True,
            stream=True,
            excluded_tags=["header", "footer"],
            exclude_all_images=True,
            only_text=True,
            check_robots_txt=True,
            remove_forms=True,
            remove_consent_popups=True,
            max_retries=2,
            scan_full_page=True,
            wait_for_images=True,
            scroll_delay=2.0,
            cache_mode=CacheMode.BYPASS,
            locale="ko-KO",
            fetch_ssl_certificate=True,
            exclude_domains=["*/account*,*/login*"],
            proxy_config=[
                ProxyConfig.DIRECT,
                ProxyConfig(
                    server="https://prox1.myblog.com:8080",
                    username="jason",
                    password="3xamp1e3",
                ),
                ProxyConfig(
                    server="https://prox2.myblog.com:80",
                    username="michael",
                    password="!Passw0rd",
                )
            ]

        )

        browser_config = BrowserConfig(
            headless=False, #headless = easily detected
            enable_stealth=True,
            # browser_mode="builtin",
            verbose=True,
            avoid_ads=True,
            avoid_css=True,
            use_persistent_context=True,
            text_mode=True
        )
        adapter = UndetectedAdapter()
        strategy = AsyncPlaywrightCrawlerStrategy(
            browser_config=browser_config,
            browser_adapter=adapter,
            
        )

        results=[]
        fail_count=0
        fail_url_list=[]
        async with AsyncWebCrawler(
            crawler_strategy=strategy,
            config=browser_config
        ) as crawler:

            async for result in await crawler.arun(
                url=url,
                config=config,
                headers={"Accept-Language": "ko-KO,ko;q=0.9"}
            ):
                if not result.success and result.status_code == 403:
                    print("Access denied by robots.txt")
                    fail_count+=1
                    fail_url_list.append(result.url)

                # print(result.markdown, "\n\n\n\n\n*******************")
                results+=result

            print(f"{len(results)} pages are crawled and {fail_count} pages are failed")
            for u in fail_url_list:
                print(u+"\n\n")

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

    async def adaptiveCrawling(url: str, 
                               query: str|None, 
                               checkpoint: str|None="adaptive_crawl_progress.json",
                               resume: bool = False):
        async with AsyncWebCrawler() as crawler:
            config = AdaptiveConfig(
                confidence_threshold=0.9,
                max_pages=50,
                top_k_links=3,
                min_gain_threshold=0.1,
                save_state=True,
                state_path=checkpoint,
            )
            adaptive = AdaptiveCrawler(crawler=crawler, config=config)

            result = await adaptive.digest(
                start_url=url,
                query = query,
                resume_from= checkpoint if resume else None
            )

            # print(result.save("./"))
            if result.metrics.get("is_irrelevant", False):
                print("query is unrelated to content")
                return {"status": "query is unrelated to content"}

            for doc in adaptive.get_relevant_content(top_k=5):
                print(f"\n From: {doc['url']}")
                print(f"\n Relevance: {doc['score']:.2%}")
                print(doc['content'][:5000] + "...")
                

