# 🕵️‍♂️ High-Risk Entity Scraper API (NestJS)

## 📘 Overview

This project is a **REST API built with NestJS** that performs **web scraping** on public databases to identify entities appearing on **high-risk or sanction lists**, such as:

- **OFAC Sanctions List**
- **World Bank Debarred Firms**
- **Offshore Leaks Database**

The API accepts a query name (e.g. company or person), scrapes multiple sources, and returns a combined JSON response with the number of hits and relevant attributes.

---

## 🚀 Objectives

- Automate entity search in high-risk/sanction lists.
- Provide a **REST API endpoint** for quick lookup.
- Limit API usage to 20 calls per minute.
- Require **JWT authentication** for access.
- Return structured JSON results with total count and per-source breakdown.

---

## 🧩 Architecture

```text
Client (Postman)
   ↓
[NestJS Controller]
   ↓
[Scraper Service]
   ↓
    ├─> OFAC Scraper
    ├─> World Bank Scraper
    └─> Offshore Leaks Scraper
   ↓
[Aggregation Service → Combine + Format Results]
   ↓
[Response → JSON with count + entities]
```

## 🧰 Tech Stack

| Tool                 | Purpose                                        |
| -------------------- | ---------------------------------------------- |
| **NestJS**           | Backend framework                              |
| **Axios**            | HTTP requests                                  |
| **Cheerio**          | HTML parsing (web scraping)                    |
| **Puppeteer**        | Headless browser for dynamic pages (e.g. OFAC) |
| **JWT (Passport)**   | Authentication                                 |
| **nestjs/throttler** | Rate limiting (20 calls/minute)                |
| **Class-validator**  | Request validation                             |
| **Postman**          | API testing                                    |

## ⚙️ Installation 
### 1️⃣ Install dependencies
    npm install

### 2️⃣ Configure environment variables
Create a .env file in the root folder:

    PORT=3000
    JWT_SECRET=supersecretkey
    SCRAPER_TIMEOUT=15000

### 4️⃣ Run the server
    npm run start:dev
API will be available at http://localhost:3000