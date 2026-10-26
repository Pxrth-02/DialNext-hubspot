# DialNext HubSpot — Contact & Note Synchronization Engine

A production-grade, full-stack application connecting to HubSpot CRM via OAuth 2.0, automatically synchronizing CRM contacts into a local/managed PostgreSQL database, and reliably syncing application-created notes back to HubSpot using a durable Outbox and background queue architecture.

---

## 🌟 Key Features

- **HubSpot OAuth 2.0:** Secure authorization flow with state verification, token exchange, server-side encryption at rest (AES-256-GCM), and automated token refresh.
- **Automatic Contact Ingestion:** Streams contacts from HubSpot CRM upon initial connection with pagination, checkpointing, and idempotent upserts in PostgreSQL (preventing duplicates).
- **Durable Notes Outbox:** Local-first note creation associated with contacts, persisted in PostgreSQL and reliably dispatched to HubSpot via BullMQ background workers with bounded retries and exponential backoff.
- **Architected for Scale:** Designed to handle high-throughput workloads (up to 100,000 contacts/min architectural target) with rate-limit mitigation and horizontal worker scaling.
- **Modern, Accessible UI:** React 18, Vite, TypeScript, Tailwind CSS, Lucide icons, responsive layout, and robust state feedback.

---

## 🏗️ Architecture Overview

```
                      +-----------------------------+
                      |   React + Vite Frontend     |
                      |      (Deployed on Vercel)   |
                      +--------------+--------------+
                                     |
                       REST API (JSON / CORS)
                                     |
                                     v
                      +-----------------------------+
                      |     Express API Service     |
                      |   (Node.js / TypeScript)    |
                      |    (Deployed on Render)     |
                      +-------+-------------+-------+
                              |             |
           Prisma ORM (SQL)   |             |  BullMQ Job Producer
                              v             v
             +------------------+         +------------------+
             |    PostgreSQL    |         |  Redis Key Value |
             | Database Engine  |         | (Queue & State)  |
             +------------------+         +--------+---------+
                              ^                    |
             Prisma ORM (SQL) |                    | BullMQ Job Consumer
                              |                    v
                      +-------+---------------------+
                      |   Background Worker Engine  |
                      |   (Render Background Worker)|
                      +--------------+--------------+
                                     |
                        HubSpot REST API v3 (OAuth)
                                     v
                      +-----------------------------+
                      |    HubSpot CRM Platform     |
                      +-----------------------------+
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Lucide React |
| **Backend API** | Node.js (v24+), Express, TypeScript, Zod, CORS |
| **Database & ORM** | PostgreSQL, Prisma ORM |
| **Background Processing** | BullMQ, Redis (Render Key Value) |
| **Deployment** | Vercel (Frontend), Render (API & Worker), Render PostgreSQL & Redis |

---

## 📁 Repository Structure

```text
DialNext-hubspot/
├── frontend/             # React 18 + Vite + Tailwind CSS client
│   ├── src/
│   │   ├── components/   # Reusable UI primitives (Button, Card, StatusBadge, etc.)
│   │   ├── types/        # TypeScript interfaces & domain models
│   │   ├── App.tsx       # Main application layout and states
│   │   └── main.tsx      # Entry point
│   ├── package.json
│   └── vite.config.ts
├── backend/              # Express API & modular architecture
│   ├── src/
│   │   ├── config/       # Environment variables & startup validation (Zod)
│   │   ├── controllers/  # Request / response orchestration
│   │   ├── middleware/   # Centralized error handling, CORS, validation
│   │   ├── routes/       # Health, OAuth, contacts, notes routes
│   │   ├── services/     # Core business logic
│   │   ├── utils/        # Sanitized logger
│   │   ├── app.ts        # Express app configuration
│   │   └── server.ts     # Server startup and graceful shutdown
│   ├── package.json
│   └── tsconfig.json
├── docs/                 # In-depth architectural & operational documentation
│   ├── TECHNICAL_DESIGN.md
│   ├── FILE_MAP.md
│   ├── RUNBOOK.md
│   ├── DATABASE_GUIDE.md
│   └── API_REFERENCE.md
├── .env.example          # Root template for environment variables
├── .gitignore            # Clean version control exclusions
└── README.md
```

---

## 🚀 Quickstart & Local Development

### 1. Prerequisites
- Node.js `v20+` or `v24+`
- npm `v10+`
- PostgreSQL instance running locally or hosted
- Redis instance running locally or hosted

### 2. Clone & Inspect Setup
```bash
git clone https://github.com/Pxrth-02/DialNext-hubspot.git
cd DialNext-hubspot
```

### 3. Backend Setup
```bash
cd backend
npm install
npm run typecheck
npm run dev
```
The API server starts on `http://localhost:5000`. Test liveness:
```bash
curl http://localhost:5000/health
```

### 4. Frontend Setup
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
The frontend starts on `http://localhost:5173`.

---

## 🔒 Security Architecture

- **Zero Secrets in Git:** Sensitive files (`.env`, credentials) are strictly ignored in `.gitignore`.
- **Sanitized Logging:** The built-in logger recursively strips sensitive keys (`password`, `token`, `secret`, `authorization`, `encryption_key`) before output.
- **Fail-Fast Startup:** Environment variables are strictly validated on process startup using Zod. Missing required variables prevent server boot with explicit error details.

---

## 📚 Technical Documentation

- [Technical Design](docs/TECHNICAL_DESIGN.md)
- [Repository File Map](docs/FILE_MAP.md)
- [Operational Runbook](docs/RUNBOOK.md)

---

## 👤 Author & Maintainer

**Parth Mittal** ([@Pxrth-02](https://github.com/Pxrth-02))  
Assignment submission for DialNext Full Stack Developer Technical Assignment.
