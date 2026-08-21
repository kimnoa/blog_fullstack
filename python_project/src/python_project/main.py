import asyncio
from crawl4ai import *
from fastapi import FastAPI, Response
from crawlAgent import CrawlAgent
import time

# defaultUrl = "https://www.aitimes.com/"
# https://www.sciencetimes.co.kr/

app = FastAPI()


@app.get("/")
def read():
    print("check")
    return {"result" : "200"}
    

@app.get("/url/{url_name:path}")
def find_data(url_name:str, keywordlist:str|None=None, response:Response=Response()):
    if not url_name.startswith(("https://","http://")):
        response.status_code = 400
        print("ERROR: URL must start with 'http://' or 'https://'")
        return {
            "error": "URL must start with 'http://' or 'https://'"
        }
    print("check URL:", url_name)
    # asyncio.run(CrawlAgent.crawler_agent(url_name)) #TODO
    output = asyncio.run(CrawlAgent.deepCrawling(url=url_name, keywordList=keywordlist.split("|") if keywordlist else []))
    # output = asyncio.run(CrawlAgent.adaptiveCrawling(url_name,keywordlist))

    # print(output)
    with open("crawl_result.md","w", encoding="UTF-8") as f:
        for res in output:
            if res.status_code==200:
                f.write("[HTML]")
                f.write(res.html)
                f.write("\n\n\n\n[Markdown]")
                f.write(res.markdown)
                f.write("\n\n\n")
            else:
                f.write("[error]")
                f.write(res.error_message)


    return {
        "result": "SU",
        "url" : url_name
    }
