import asyncio
from crawl4ai import *
from fastapi import FastAPI
import time

urlText = "https://www.aitimes.com/"

app = FastAPI()

@app.get("/")
def read():
    return {"id" : "10"}

@app.get("/url/{url_name}")
async def find_data(url_name:str)->None:
    urlText = url_name or "Input here"
    # await crawler_agent(urlText) //TODO

async def crawler_agent(urlText:str):
    async with AsyncWebCrawler() as crawler:
        # crawler_config = CrawlerRunConfig()
        result = await crawler.arun(
            url=urlText,
        )
        time.sleep(10)
        print(result.markdown)

if __name__ == "__main__":
    asyncio.run(crawler_agent(urlText))