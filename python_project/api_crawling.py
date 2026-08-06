import asyncio
from crawl4ai import *
from fastapi import FastAPI

urlText = "https://www.aitimes.com/"

app = FastAPI()

@app.get("/")
def read():
    return {"id" : "10"}

@app.post("/{url_name}")
def find_data(url_name:str)->None:
    urlText = url_name |"Input here"
    crawler_agent(urlText)

async def crawler_agent(urlText:str):
    async with AsyncWebCrawler() as crawler:
        # crawler_config = CrawlerRunConfig()
        result = await crawler.arun(
            url=urlText,
        )
        print(result.markdown)

if __name__ == "__main__":
    asyncio.run(crawler_agent(urlText))