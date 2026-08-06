import asyncio
from crawl4ai import *
from fastapi import FASTAPI

urlText = "Input here"

app = FASTAPI()

@app.get("/")
def read():
    return {"id" : "10"}

async def main():
    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(
            url=urlText,
        )
        print(result.markdown)

if __name__ == "__main__":
    asyncio.run(main())