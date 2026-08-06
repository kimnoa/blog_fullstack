import asyncio
from crawl4ai import *
import fastapi

urlText = "Input here"

async def main():
    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(
            url=urlText,
        )
        print(result.markdown)

if __name__ == "__main__":
    asyncio.run(main())