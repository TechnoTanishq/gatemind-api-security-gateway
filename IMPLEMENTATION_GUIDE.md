# GateMind Reverse Proxy Implementation — Complete Guide

## Overview

GateMind has been upgraded from a security inspection layer to a **full reverse proxy** that dynamically routes authenticated requests to each client's registered backend.

---

## Architecture Change

### Before
```
Client → GateMind Gateway (validate, log) → ❌ nowhere
```

### After
```
Client → GateMind Gateway (validate, secure, forward) → Client's Backend → GateMind → Client
```

---

## Changes Made

### 1. **Client Service (port 8081)**

#### Database Schema
- **Added field:** `backendBaseUrl` to `clients` table
  ```sql
  ALTER TABLE clients ADD COLUMN backend_base_url VARCHAR(255) NOT NULL;
  ```

#### Entity
- `Client.java` — added `backendBaseUrl` field

#### DTOs
- `CreateClientRequest` — now requires `backendBaseUrl`
- `CreateClientResponse` — returns `backendBaseUrl`
- `ClientListResponse` — includes `backendBaseUrl`
- `ApiKeyValidationResponse` — includes `backendBaseUrl` (critical for gateway)

#### Service
- `ClientServiceImpl.registerClient()` — saves `backendBaseUrl`
- `ClientServiceImpl.validateApiKey()` — returns `backendBaseUrl`
- `ClientServiceImpl.getAllClients()` — includes `backendBaseUrl` in list

---

### 2. **Gateway Service (port 8080)**

#### DTOs
- `CachedClient` — added `backendBaseUrl`
- `ApiKeyValidationResponse` (gateway copy) — added `backendBaseUrl`
- `RequestContext` — added `backendBaseUrl`

#### Filters (Pipeline Order)

1. **RequestContextFilter** (Order=1) — creates request context
2. **CorrelationIdFilter** (Order=2) — adds correlation ID
3. **ApiKeyAuthenticationFilter** (Order=3) — validates API key, loads client, caches `backendBaseUrl`
4. **RateLimiterFilter** (Order=4) — enforces rate limits per plan
5. **ThreatDetectionFilter** (Order=5) — detects SQL injection, XSS, etc.
6. **ProxyForwardingFilter** (Order=6) ⭐ **NEW** — forwards request to `backendBaseUrl`

#### New: ProxyForwardingFilter

**Purpose:** Dynamically forwards requests to the client's registered backend.

**Logic:**
1. Reads `backendBaseUrl` from exchange attributes (set by `ApiKeyAuthenticationFilter`)
2. Builds full target URL: `backendBaseUrl + originalPath + query`
3. Copies all headers except hop-by-hop and `X-API-Key`
4. Forwards the request using `WebClient` (non-blocking)
5. Mirrors upstream response (status, headers, body) back to caller

**Admin Route Exclusion:**
All filters now skip:
- `/analytics/**` (dashboard analytics API)
- `/api/v1/clients/**` (client management admin API)
- `/admin/**` (reserved for future admin routes)

This ensures admin endpoints don't require API keys or proxying.

#### Configuration
- `application.yml` — static routes only for admin APIs, all other traffic is proxied dynamically

---

### 3. **Frontend (React Admin Dashboard)**

#### Registration Form
- `RegisterClientModal` — added `backendBaseUrl` input field
- Validation: must start with `http://` or `https://`
- Placeholder: `http://localhost:8085`

#### API Client
- `clientsApi.registerClient()` — includes `backendBaseUrl` in payload

#### Clients Table
- Displays `backendBaseUrl` column for each registered client

---

### 4. **Demo Backend (port 8085)**

A minimal Spring Boot app simulating a customer's real backend.

**Endpoints:**
- `GET /movies` — list all movies
- `GET /movies/{id}` — get movie by ID
- `POST /movies` — create a movie

**Purpose:** Show the full proxy flow live during demos/interviews.

---

## Demo Flow (For Interviews)

### Step 1: Direct Backend Access (Before GateMind)

```bash
curl http://localhost:8085/movies
```

Response:
```json
[
  {"id":1,"title":"Inception","genre":"Sci-Fi"},
  {"id":2,"title":"The Dark Knight","genre":"Action"},
  {"id":3,"title":"Interstellar","genre":"Sci-Fi"}
]
```

---

### Step 2: Register Client in GateMind

1. Open Admin Dashboard: `http://localhost:5173`
2. Go to **Clients** page
3. Click **Register Client**
4. Fill in:
   - **Company Name:** `Netflix`
   - **Email:** `admin@netflix.com`
   - **Backend Base URL:** `http://localhost:8085`
   - **Plan:** `FREE`
5. Click **Register**

**Result:**
- API Key returned: `gm_live_xxxxxxxxxxxxxxxxxx`
- Copy this key

---

### Step 3: Access Via GateMind (After Registration)

```bash
curl http://localhost:8080/movies \
  -H "X-API-Key: gm_live_xxxxxxxxxxxxxxxxxx"
```

**Same response**, but now:
- ✅ API key authenticated
- ✅ Rate limit checked (5 req/min for FREE plan)
- ✅ Threat detection ran
- ✅ Request logged in analytics
- ✅ Forwarded to `http://localhost:8085/movies`

---

### Step 4: Inject Attack (Show Threat Detection)

```bash
curl "http://localhost:8080/movies?id=1' OR '1'='1" \
  -H "X-API-Key: gm_live_xxxxxxxxxxxxxxxxxx"
```

**Result:**
```json
{
  "error": "Threat(s) detected",
  "code": "HIGH_RISK_REQUEST",
  "findings": ["SQL Injection detected in query parameter"]
}
```

- ❌ Request **blocked** before reaching backend
- ✅ Threat logged in dashboard under **Recent Threats**

---

### Step 5: Exceed Rate Limit

```bash
for i in {1..7}; do
  curl http://localhost:8080/movies \
    -H "X-API-Key: gm_live_xxxxxxxxxxxxxxxxxx"
done
```

**Result after 5th request:**
```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED"
}
```

- ❌ Requests 6+ blocked
- ✅ Headers show `X-RateLimit-Remaining: 0`

---

## Start Services

### 1. Start PostgreSQL & Redis

```bash
# PostgreSQL (port 5432)
docker run -d -p 5432:5432 \
  -e POSTGRES_DB=gatemind_client \
  -e POSTGRES_USER=tanishq \
  -e POSTGRES_PASSWORD=tanishq123 \
  postgres:15

# Redis (port 6379)
docker run -d -p 6379:6379 redis:7
```

### 2. Start Client Service

```bash
cd client-service
./mvnw spring-boot:run
```

Runs on **port 8081**.

### 3. Start Gateway Service

```bash
cd gateway-service
./mvnw spring-boot:run
```

Runs on **port 8080**.

### 4. Start Demo Backend

```bash
cd demo-backend
./mvnw spring-boot:run
```

Runs on **port 8085**.

### 5. Start Admin Dashboard

```bash
cd gatemind-admin-dashboard/gatemind
npm install
npm run dev
```

Runs on **port 5173**.

---

## Testing Checklist

- [ ] Register a client with backend URL `http://localhost:8085`
- [ ] Copy issued API key
- [ ] `curl http://localhost:8080/movies` with key → should return movies
- [ ] `curl http://localhost:8080/movies/1` with key → should return single movie
- [ ] POST request with key → should create movie
- [ ] Send SQL injection payload → should be blocked
- [ ] Exceed rate limit → should be blocked after 5 requests
- [ ] Check dashboard → all events logged under **Recent Threats** and **Attack Trend**
- [ ] Verify analytics update live

---

## Key Benefits

1. **Zero Code Changes for Customers** — just change base URL + add API key header
2. **Transparent Proxying** — backend never knows GateMind exists
3. **Full Security Pipeline** — auth, rate limiting, threat detection all happen before forwarding
4. **Dynamic Routing** — supports thousands of clients, each with their own backend
5. **Production-Ready** — reactive, non-blocking, horizontally scalable

---

## Next Steps (Optional Enhancements)

1. **Custom Routing Rules** — per-client path rewrites, header injection
2. **Circuit Breaker** — Resilience4j integration for upstream failures
3. **Request/Response Transformation** — modify payloads on-the-fly
4. **Load Balancing** — support multiple backend instances per client
5. **SSL/TLS Termination** — handle HTTPS upstream backends
6. **Detailed Client Analytics** — per-client request volume, latency metrics
7. **WebSocket Support** — proxy WebSocket connections
8. **gRPC Support** — proxy gRPC calls

---

## Architecture Diagram

```
┌──────────┐
│  Client  │
│  (cURL,  │
│   App)   │
└────┬─────┘
     │ X-API-Key: gm_live_xxx
     ▼
┌────────────────────────────────────────────────┐
│         GateMind Gateway (port 8080)           │
│                                                │
│  1. Validate API Key                           │
│  2. Load Client (from Redis or DB)             │
│  3. Check Rate Limit                           │
│  4. Threat Detection (SQL, XSS, etc.)          │
│  5. Log Security Event                         │
│  6. ⭐ Forward → backendBaseUrl + path         │
└────────────────┬───────────────────────────────┘
                 │
                 ▼
        ┌─────────────────┐
        │  Client Backend │
        │  (port 8085)    │
        │  /movies API    │
        └─────────────────┘
```

---

**End of Implementation Guide**
