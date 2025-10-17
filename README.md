# 🕵️‍♂️ High-Risk Entity Scraper API (NestJS)

## 📘 Overview

This project is a **REST API built with NestJS** that performs **web scraping** on public databases to identify entities appearing on **high-risk or sanction lists**, such as:

- **OFAC Sanctions List**
- **World Bank Debarred Firms**

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
[Name DTO]
   ↓
[Scraper Service]
   ↓
    ├─> OFAC Scraper
    ├─> World Bank Scraper
   ↓
[Response → JSON with count + entities]
```

## 🧰 Tech Stack

| Tool                 | Purpose                                        |
| -------------------- | ---------------------------------------------- |
| **NestJS**           | Backend framework                              |
| **Cheerio**          | HTML parsing (web scraping)                    |
| **Puppeteer**        | Headless browser for dynamic pages (e.g. OFAC) |
| **JWT (Passport)**   | Authentication                                 |
| **nestjs/throttler** | Rate limiting (20 calls/minute)                |
| **Class-validator**  | Request validation                             |
| **Postman**          | API testing                                    |

## ⚙️ Installation 
### 1️⃣ Install dependencies
    npm install

### 2️⃣ Run the server
    npm run start:dev
API will be available at http://localhost:3000

---

## 🔌 API Endpoints

### **Search Entity in High-Risk Lists**

**Endpoint:** `GET /api/v1/entities/{name}/risk-assessment`

**Description:** Searches for an entity (company or person) across multiple high-risk databases including OFAC sanctions and World Bank debarred firms.

**Parameters:**
- `name` (string, required): The name of the entity to search for
  - Automatically converts numbers to strings
  - Trims whitespace
  - Cannot be empty

**Example Requests:**
```bash
# Search for a company
GET http://localhost:3000/api/v1/entities/ACME%20CORP/risk-assessment
```

**Success Response (200 OK):**
```json
{
  "ofacResults": {
    "source": "OFAC Sanctions List",
    "totalHits": 2,
    "entities": [
      {
        "id": 1,
        "name": "ACME CORP",
        "type": "Entity",
        "programs": ["CUBA"],
        "sourceList": "SDN",
        "addresses": [
          {
            "address": "123 Main St",
            "city": "Havana",
            "country": "Cuba",
            "state": ""
          }
        ]
      }
    ]
  },
  "worldBankResults": {
    "source": "World Bank Debarred Firms",
    "totalHits": 1,
    "entities": [
      {
        "firmName": "ACME CORPORATION",
        "countryName": "Cuba",
        "city": "Havana",
        "address": "123 Main Street",
        "grounds": "Procurement Guidelines 1.15(a)",
        "fromDate": "2020-01-01",
        "status": "DEBARRED"
      }
    ]
  },
  "summary": {
    "totalMatches": 3,
    "sources": ["OFAC", "World Bank"]
  }
}
```

**Error Responses:**

**400 Bad Request** - Invalid input:
```json
{
  "statusCode": 400,
  "message": "Validation failed: Name cannot be empty",
  "error": "Bad Request"
}
```

**404 Not Found** - No results:
```json
{
  "ofacResults": {
    "source": "OFAC Sanctions List",
    "totalHits": 0,
    "entities": []
  },
  "worldBankResults": {
    "source": "World Bank Debarred Firms",
    "totalHits": 0,
    "entities": []
  },
  "summary": {
    "totalMatches": 0,
    "sources": []
  }
}
```

**500 Internal Server Error** - Service unavailable:
```json
{
  "statusCode": 500,
  "message": "Failed to fetch data from external sources",
  "error": "Internal Server Error"
}
```

---

## 🧪 Testing with Postman

### **1. Basic Search Request**
```http
GET http://localhost:3000/api/v1/entities/CORPORATION/risk-assessment
```
