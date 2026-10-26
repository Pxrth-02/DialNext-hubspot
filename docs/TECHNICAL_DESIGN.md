# DialNext HubSpot — Technical Design Document

## 1. System Goals and Philosophy

The **DialNext HubSpot** integration solves the challenge of synchronizing high-volume CRM contacts and bi-directional notes between a web platform and HubSpot CRM.

The system is designed with four fundamental engineering tenets:
1. **Idempotence & Data Integrity:** Network failures, retries, or duplicate sync triggers must never create duplicate records or corrupt data.
2. **Local-First Durability (Transactional Outbox):** Operations that mutate external third-party services (like creating notes in HubSpot) are first persisted in local PostgreSQL before enqueueing to background workers.
3. **Defense in Depth (Security):** Tokens are encrypted at rest using AES-256-GCM. Logs are recursively sanitized. Secrets are never checked into version control or sent to client browsers.
4. **Resilience & Rate Limit Compliance:** Background jobs use bounded retries with exponential backoff and jitter to comply with HubSpot API rate limits.

---

## 2. Core Architectural Components

### 2.1 Frontend Client (Vercel)
- **Framework:** React 18 with Vite and TypeScript.
- **Styling:** Tailwind CSS with custom glassmorphic styling and accessibility-focused primitives.
- **State Responsibility:** Maintains user connection state, renders live contact and note lists, and handles user interactions. All business logic, secrets, and API credentials remain strictly on the backend.

### 2.2 Express API Service (Render Web Service)
- **Role:** Handles incoming HTTP traffic, OAuth callback redirection, user-created note ingestion, and query endpoints.
- **Layer Separation:**
  - `Routes`: Declare URL paths and route-level middlewares.
  - `Controllers`: Parse input, call services, and return JSON HTTP responses.
  - `Services`: Encapsulate core business logic and database interactions.
  - `Middleware`: Centralized error handling, CORS, and Zod input validation.

### 2.3 PostgreSQL Database & Prisma ORM
- **Role:** Source of truth for contacts, tokens, sync checkpoints, and outbox operations.
- **Key Tables (Detailed in Phase 3):**
  - `HubspotAuth`: Encrypted access/refresh tokens, expiration timestamps, portal ID.
  - `Contact`: Ingested HubSpot contacts with unique `hubspotId` constraint.
  - `Note`: Synchronized notes mapped to contacts.
  - `OutboxJob`: Durable pending tasks waiting for worker dispatch.
  - `SyncCheckpoint`: Tracking page offsets and cursor tokens for resume capability.

### 2.4 BullMQ & Redis Key-Value Store
- **Role:** Asynchronous job queue decoupling user-facing HTTP request/response loops from slow external HubSpot API calls.
- **Queue Queues:**
  - `contact-sync-queue`: Processes paginated batches of contacts during initial sync.
  - `note-sync-queue`: Processes pending outbox notes and publishes them to HubSpot.

### 2.5 Background Worker Process (Render Background Worker)
- **Role:** Separate Node.js daemon consuming BullMQ jobs, interacting with HubSpot REST API v3, managing rate-limit delays, and updating PostgreSQL statuses.

---

## 3. High-Throughput Scaling Discussion (100,000 Contacts / Min Target)

While a real HubSpot CRM portal imposes API rate limits (e.g., 100 requests per 10-second sliding window for standard accounts), the internal processing architecture is designed to handle high throughput:

1. **Batch Upserts:** Rather than executing one SQL query per contact, contacts are ingested in batches of 100 using PostgreSQL `UNNEST` or Prisma batch upserts (`createMany` with `onConflict`).
2. **Horizontal Worker Scaling:** Background workers are stateless consumers. Adding more Render background worker instances scales job throughput horizontally.
3. **Connection Pooling:** PostgreSQL connection pooling (via PgBouncer or Prisma Accelerate) ensures database connections are not exhausted under heavy worker concurrency.

---

## 4. Security & Encryption Standards

- **Token Vault:** HubSpot OAuth access and refresh tokens are encrypted at rest using AES-256-GCM authenticated encryption. Each encrypted payload contains a unique Initialization Vector (IV) and authentication tag.
- **Credential Redaction:** The structured logger (`src/utils/logger.ts`) intercepts all outgoing logs and redacts fields matching sensitive patterns (`token`, `secret`, `authorization`, etc.).
- **Zero-Trust Environment Validation:** All required environment variables are strictly validated on application startup via Zod.
