이 조건이라면 **“크롤러를 하나의 기능으로 만들기보다, URL → 수집 → 정제 → 검수 → 저장 → AI 활용”을 하나의 파이프라인으로 설계**하는 방향을 추천합니다.

특히 지금 단계에서는 **Crawl4AI + Playwright 계열을 중심으로 하고, Selenium은 보조 수단으로 두며, LLM은 크롤링 엔진이 아니라 ‘정제/구조화 엔진’으로 사용하는 것**이 가장 적합합니다.

## 1. 전체 구조

추천 아키텍처는 다음과 같습니다.

```text
[사용자 Web]
   │
   │ URL + 키워드 + 추출 조건
   ▼
[TypeScript / Vite]
   │
   │ REST API
   ▼
[Java Spring]
   │
   ├── Crawl Job 생성
   ├── Job 상태 관리
   ├── 사용자 검수 데이터 관리
   └── DB
        ▲
        │
        │ 결과 저장
        │
   [Python Crawling Service]
        │
        ├── URL Fetch
        ├── Dynamic Rendering
        ├── HTML 추출
        ├── 본문/링크/이미지 추출
        ├── Keyword Filtering
        └── LLM Structuring
```

Docker에서는 이렇게 나누는 것을 추천합니다.

```text
docker-compose
│
├── nginx
│
├── frontend
│    └── Vite + TypeScript
│
├── backend
│    └── Spring Boot
│
├── crawler
│    └── Python + Crawl4AI
│
├── db
│    └── PostgreSQL
│
└── redis
     └── Job Queue / Cache
```

여기서 중요한 것은 **Spring과 Python을 직접 강하게 결합하지 않는 것**입니다.

---

# 2. Spring ↔ Python은 REST보다 "Job 기반"으로 설계

처음에는 다음처럼 만들기 쉽습니다.

```text
Spring
   ↓ HTTP
Python
   ↓
크롤링 완료
   ↓
Spring
```

하지만 실제 서비스가 커지면 문제가 생깁니다.

예를 들어 사용자가

```text
URL 100개 입력
```

하면 Python 크롤러가 100개를 처리하는 동안 Spring 요청이 계속 붙잡혀 있는 구조가 됩니다.

따라서 처음부터:

```text
POST /crawl/jobs
```

로 Job을 생성하고,

```json
{
  "url": "https://example.com",
  "keywords": [
    "가격",
    "제품명",
    "출시일"
  ],
  "extractMode": "article"
}
```

Spring이

```text
jobId = 123
status = QUEUED
```

를 반환하게 하는 것을 추천합니다.

그 다음 Python이:

```text
QUEUED
  ↓
CRAWLING
  ↓
EXTRACTING
  ↓
STRUCTURING
  ↓
REVIEW
  ↓
COMPLETED
```

형태로 처리합니다.

---

# 3. Crawl4AI를 메인으로 추천

현재 Crawl4AI를 테스트하고 있다면 **일단 Crawl4AI를 계속 가져가는 것을 추천**합니다.

특히 이 서비스의 핵심 요구사항이

> URL 입력 → 동적 페이지 실행 → 필요한 데이터 추출

이기 때문입니다.

Selenium을 메인으로 가져가면 직접 구현해야 하는 부분이 상당히 많습니다.

반면 Crawl4AI는 AI 데이터 수집을 고려한 구조이기 때문에 현재 목적과 더 잘 맞습니다.

### 추천 우선순위

```text
1순위  Crawl4AI
2순위  Playwright 직접 제어
3순위  Selenium
4순위  LLM
```

여기서 **LLM은 크롤러 대체재가 아닙니다.**

이 구분이 굉장히 중요합니다.

---

# 4. "크롤링"과 "데이터 정제"를 분리해야 함

예를 들어 사용자가

```text
https://example.com/products
```

를 입력했다고 해보겠습니다.

크롤러가 가져온 원본은:

```text
HTML
CSS
Javascript
Navigation
Footer
광고
본문
제품 정보
댓글
...
```

입니다.

여기에서 LLM에게 바로

> 이 페이지에서 필요한 정보를 가져와줘

라고 하는 것보다 다음 단계로 나누는 것이 좋습니다.

```text
URL
 ↓
Browser Rendering
 ↓
HTML
 ↓
DOM Cleaning
 ↓
Main Content Extraction
 ↓
Keyword Filtering
 ↓
LLM Structuring
 ↓
Validation
 ↓
Human Review
 ↓
DB
```

이 구조가 핵심입니다.

---

# 5. LLM은 "추출"보다 "구조화"에 사용

예를 들어 사용자가 키워드를 입력합니다.

```text
키워드:
- 상품명
- 가격
- 할인율
- 제조사
```

페이지에는:

```text
Samsung Galaxy S26
₩1,399,000
현재 10% 할인
제조사: Samsung
...
```

이런 내용이 있을 수 있습니다.

LLM에는 HTML 전체를 무작정 넣는 것이 아니라 정제된 텍스트를 넣습니다.

그리고 결과를 JSON Schema 형태로 받습니다.

```json
{
  "productName": "Samsung Galaxy S26",
  "price": 1399000,
  "discountRate": 10,
  "manufacturer": "Samsung"
}
```

즉:

```text
Crawler
= 데이터를 가져오는 역할

Parser
= 데이터를 정리하는 역할

LLM
= 의미를 이해하고 구조화하는 역할

Spring
= 서비스/상태/권한/DB 관리

Frontend
= 사용자 검수
```

이렇게 역할을 분리하는 것이 좋습니다.

---

# 6. 사용자 검수 UI가 굉장히 중요

말씀하신

> 확인하며 수정할 수 있어야 한다.

이 부분을 처음부터 핵심 기능으로 잡는 것을 추천합니다.

예를 들어:

```text
┌──────────────────────────────────────┐
│ URL                                  │
│ https://example.com/product/123      │
└──────────────────────────────────────┘

키워드
[상품명] [가격] [제조사]

           [크롤링 시작]
```

크롤링이 끝나면:

```text
┌──────────────────────────────────────┐
│ 추출 결과                            │
├──────────────────────────────────────┤
│ 상품명                               │
│ Samsung Galaxy S26        [수정]    │
│                                      │
│ 가격                                 │
│ 1,399,000                 [수정]     │
│                                      │
│ 제조사                               │
│ Samsung                   [수정]     │
└──────────────────────────────────────┘

[원본 보기] [AI 재분석] [저장]
```

그리고 가능하다면 **원본 페이지와 추출 결과를 같이 보여주는 UI**가 좋습니다.

```text
┌───────────────┬─────────────────────┐
│ Original Page │ Extracted Data      │
│               │                     │
│ Samsung ...   │ 상품명: Samsung...  │
│ ₩1,399,000    │ 가격: 1,399,000     │
│               │                     │
└───────────────┴─────────────────────┘
```

이렇게 해야 AI가 잘못 추출했을 때 사용자가 바로 수정할 수 있습니다.

---

# 7. "키워드"를 단순 문자열 검색으로 만들지 않는 게 좋음

처음에는

```text
keywords = ["가격", "상품명"]
```

정도로 시작해도 됩니다.

하지만 나중에는 다음과 같이 발전시키는 것을 추천합니다.

### 단순 키워드

```text
가격
상품명
제조사
```

↓

### 추출 필드

```json
{
  "name": {
    "label": "상품명",
    "type": "string"
  },
  "price": {
    "label": "가격",
    "type": "number"
  },
  "manufacturer": {
    "label": "제조사",
    "type": "string"
  }
}
```

↓

### Extraction Schema

```json
{
  "name": "string",
  "price": "number",
  "manufacturer": "string"
}
```

이렇게 가면 상당히 강력해집니다.

사용자가 직접:

```text
필드 추가

필드명: 출시일
타입: DATE
설명: 제품이 공식 출시된 날짜
```

라고 만들 수 있습니다.

그리고 이것을 LLM에게 전달합니다.

---

# 8. 결국 "사용자 정의 Extraction Schema"가 핵심

서비스가 발전하면 최종적으로 이런 화면을 만들 수 있습니다.

```text
URL
────────────────────────

추출할 데이터

┌──────────┬──────────┬────────────────────┐
│ Field    │ Type     │ Description        │
├──────────┼──────────┼────────────────────┤
│ title    │ String   │ 상품명             │
│ price    │ Number   │ 판매 가격          │
│ company  │ String   │ 제조사             │
│ date     │ Date     │ 출시일             │
└──────────┴──────────┴────────────────────┘

[+ 필드 추가]

              [데이터 추출]
```

그러면 같은 크롤러를 가지고도:

```text
뉴스
상품
블로그
채용공고
논문
문서
부동산
여행
```

등 다양한 데이터를 추출할 수 있습니다.

---

# 9. Python 내부 구조도 계층화하는 것을 추천

Python을 단순히:

```text
crawler.py
```

하나로 만들지 않는 게 좋습니다.

예를 들면:

```text
crawler/
│
├── api/
│   └── crawler_api.py
│
├── core/
│   ├── browser.py
│   ├── crawler.py
│   └── extractor.py
│
├── parsers/
│   ├── html_parser.py
│   ├── article_parser.py
│   └── product_parser.py
│
├── llm/
│   ├── client.py
│   ├── prompt.py
│   └── structured_output.py
│
├── models/
│   ├── crawl_job.py
│   └── extraction_schema.py
│
└── worker/
    └── crawl_worker.py
```

특히 이 부분을 분리하세요.

```text
Crawler
Parser
Extractor
LLM
```

---

# 10. Selenium은 어디에 사용하는가?

Selenium을 완전히 버릴 필요는 없습니다.

예를 들어 특정 사이트가:

```text
Cloudflare
복잡한 로그인
특정 브라우저 fingerprint
특수 interaction
```

등을 요구한다면 Selenium/Playwright 계열을 fallback으로 사용할 수 있습니다.

구조를:

```text
Crawler Manager
      │
      ├── Crawl4AI
      │
      ├── Playwright
      │
      └── Selenium
```

처럼 만드는 것입니다.

그리고 사이트별로:

```text
crawlerStrategy
```

를 선택합니다.

다만 **처음부터 세 가지를 동시에 구현하지는 마세요.**

MVP는:

```text
Crawl4AI
  ↓
실패하면 Playwright
```

정도로 시작하는 것을 추천합니다.

---

# 11. DB 설계도 "원본"과 "가공 데이터"를 분리

이 부분도 매우 중요합니다.

최소한 다음 정도는 필요합니다.

```text
crawl_job
crawl_source
crawl_raw_data
extraction_schema
extraction_result
review
```

예를 들면:

### crawl_job

```text
id
url
status
created_at
completed_at
error_message
```

### crawl_raw_data

```text
id
job_id
html
cleaned_text
metadata
created_at
```

### extraction_schema

```text
id
name
schema_json
created_at
```

### extraction_result

```text
id
job_id
schema_id
result_json
confidence
created_at
```

### review

```text
id
result_id
original_json
edited_json
review_status
reviewer
updated_at
```

특히 **original_json과 edited_json을 모두 보관**하는 것을 추천합니다.

그래야 나중에:

```text
AI가 추출한 값
        ↓
사용자가 수정한 값
        ↓
차이 분석
```

을 할 수 있습니다.

이 데이터는 향후 AI 품질 개선에도 상당히 유용합니다.

---

# 12. Redis를 넣는 것도 추천

Docker 환경이라면 Redis를 추가하는 것이 좋습니다.

```text
Spring
   ↓
Redis Queue
   ↓
Python Worker
   ↓
Crawl4AI
```

예를 들어 사용자가 URL 50개를 입력해도:

```text
Job 1
Job 2
Job 3
...
Job 50
```

을 queue에 넣고 worker가 순차/병렬 처리할 수 있습니다.

나중에는:

```text
crawler-worker-1
crawler-worker-2
crawler-worker-3
```

처럼 확장할 수도 있습니다.

---

# 13. API는 이렇게 시작하면 좋음

Spring API:

```text
POST   /api/crawl/jobs
GET    /api/crawl/jobs/{id}
GET    /api/crawl/jobs/{id}/result

POST   /api/extractions
PUT    /api/extractions/{id}
POST   /api/extractions/{id}/review

GET    /api/schemas
POST   /api/schemas
PUT    /api/schemas/{id}
```

Python API는 외부 사용자에게 공개하지 않고 내부용으로:

```text
POST /internal/crawler/jobs
GET  /internal/crawler/jobs/{id}
```

정도로 두는 게 좋습니다.

또는 Redis 기반 worker라면 Python API 자체가 필요 없어질 수도 있습니다.

---

# 14. 추천하는 최종 데이터 흐름

제가 이 서비스를 만든다면 다음과 같이 구성하겠습니다.

```text
                ┌──────────────┐
                │   Browser    │
                │ Vite + TS    │
                └──────┬───────┘
                       │
                       ▼
                ┌──────────────┐
                │ Spring Boot  │
                │ API Server   │
                └──────┬───────┘
                       │
                 Create Job
                       │
                       ▼
                ┌──────────────┐
                │    Redis     │
                │     Queue    │
                └──────┬───────┘
                       │
                       ▼
              ┌─────────────────┐
              │ Python Worker   │
              │                 │
              │ Crawl4AI        │
              │      ↓          │
              │ HTML            │
              │      ↓          │
              │ Cleaner         │
              │      ↓          │
              │ Keyword Filter  │
              │      ↓          │
              │ LLM             │
              │      ↓          │
              │ JSON Schema     │
              └────────┬────────┘
                       │
                       ▼
                ┌──────────────┐
                │ PostgreSQL   │
                └──────┬───────┘
                       │
                       ▼
                ┌──────────────┐
                │ Review UI    │
                │              │
                │ 확인 / 수정  │
                └──────────────┘
```

---

# 15. MVP는 여기까지만 만들 것을 추천

처음부터 AI 비서 전체를 만들면 범위가 너무 커집니다.

### Phase 1

```text
URL 입력
 ↓
Crawl4AI
 ↓
Clean Text
 ↓
웹 화면 출력
```

먼저 이것을 성공시키세요.

### Phase 2

```text
URL
+
Keyword
 ↓
Keyword Filtering
 ↓
결과 출력
```

### Phase 3

```text
URL
+
Extraction Schema
 ↓
LLM
 ↓
Structured JSON
 ↓
사용자 수정
 ↓
DB 저장
```

### Phase 4

```text
여러 URL
 ↓
Queue
 ↓
병렬 Crawling
 ↓
자동 정제
 ↓
DB
```

### Phase 5

```text
저장된 데이터
 ↓
Embedding
 ↓
Vector DB
 ↓
RAG
 ↓
Chatbot / AI Assistant
```

---

# 16. 특히 "크롤링 결과 → 바로 Vector DB"는 피하는 게 좋음

AI 비서까지 생각하고 있다면 흔히 다음과 같이 만들기 쉽습니다.

```text
URL
 ↓
Crawl
 ↓
Embedding
 ↓
Vector DB
```

저라면 이렇게 하지 않습니다.

대신:

```text
URL
 ↓
Raw HTML
 ↓
Clean Document
 ↓
Structured Data
 ↓
Human Review
 ↓
Canonical Data
 ├── PostgreSQL
 └── Vector DB
```

로 갑니다.

왜냐하면 사용자가 직접 수정할 수 있어야 하기 때문입니다.

그리고 나중에는:

```text
원본
AI 추출값
사용자 수정값
최종 확정값
```

이라는 데이터 계층을 만들 수 있습니다.

이게 향후 AI 품질 개선에 매우 중요합니다.

---

## 제가 선택한다면

현재 기술 스택을 유지하면서 다음 조합으로 시작하겠습니다.

| 영역         | 선택                                    |
| ---------- | ------------------------------------- |
| Frontend   | TypeScript + Vite                     |
| Web Server | Nginx                                 |
| API        | Spring Boot                           |
| Crawler    | **Crawl4AI**                          |
| Browser    | Playwright 계열                         |
| Fallback   | Selenium                              |
| Queue      | **Redis**                             |
| DB         | PostgreSQL                            |
| AI         | LLM API                               |
| 검색/RAG     | PostgreSQL + pgvector 또는 별도 Vector DB |
| 실행 환경      | Docker + WSL                          |

그리고 가장 중요한 설계 원칙은:

> **Spring은 서비스의 주체, Python은 데이터 수집/AI 처리 Worker로 둔다.**

입니다.

즉 **Java에서 크롤링 로직을 관리하지 말고**, Python을 독립적인 데이터 수집 엔진으로 만드는 게 좋습니다.

그리고 사용자에게는 단순히 `"URL을 크롤링한다"`가 아니라,

**URL → 원하는 데이터 필드 정의 → 자동 추출 → 원본과 결과 비교 → 사용자 수정 → 확정 → DB 저장**

이라는 경험을 제공하는 것이 이 서비스의 핵심이라고 봅니다.

원하시면 다음 단계로는 **이 구조를 실제 Docker 프로젝트로 만들 때의 `docker-compose.yml` + Spring Boot API 구조 + Python Crawl4AI Worker 구조 + PostgreSQL 테이블 설계까지 포함한 초기 프로젝트 아키텍처**를 구체적으로 잡는 것이 좋습니다.
