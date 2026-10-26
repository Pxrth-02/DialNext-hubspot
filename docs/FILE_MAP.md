# DialNext HubSpot — Repository File Map

This document explains the organization of files across the codebase, why each file exists, and what layer it belongs to.

---

## 1. Root Directory

| Path | Purpose | Layer |
| :--- | :--- | :--- |
| `.gitignore` | Excludes secrets, temporary files, `node_modules`, and local private prompts (`Global_Prompt/`) from version control. | Configuration |
| `.env.example` | Root template containing all required environment variables and safe placeholders. | Configuration |
| `README.md` | Primary project documentation, architecture diagram, and quickstart instructions. | Documentation |
| `docs/` | Comprehensive technical guides, architectural design, runbooks, and interview prep. | Documentation |
| `frontend/` | Complete React 18 + Vite + TypeScript web application client. | Presentation |
| `backend/` | Express API, background worker, services, and PostgreSQL ORM definitions. | Application / API |

---

## 2. Backend Architecture (`backend/`)

| Path | Purpose | Responsibility |
| :--- | :--- | :--- |
| `package.json` | Backend dependencies (`express`, `zod`, `cors`, `dotenv`) and npm scripts (`dev`, `build`, `typecheck`). | Manifest |
| `tsconfig.json` | Strict TypeScript configuration (target ES2022, NodeNext resolution, strict null checks). | Configuration |
| `.env.example` | Backend-specific environment template with safe placeholders. | Configuration |
| `src/server.ts` | Server bootstrap, port listening, graceful process shutdown (`SIGTERM`, `SIGINT`), and uncaught exception catching. | Lifecycle / Bootstrap |
| `src/app.ts` | Express application instance, CORS configuration, JSON body parser, request logging, and middleware binding. | Application Core |
| `src/config/env.ts` | Startup environment validation with Zod schemas. Guarantees fail-fast behavior if required configs are missing. | Configuration / Validation |
| `src/utils/logger.ts` | Structured logger with recursive sanitization to ensure tokens and secrets are never printed in logs. | Observability / Security |
| `src/middleware/errorHandler.ts` | Centralized error handler converting Zod errors and `AppError` into standardized JSON responses without leaking stack traces in production. | Middleware |
| `src/middleware/validate.ts` | Generic Zod validation middleware for request body, params, and query strings. | Middleware |
| `src/services/health.service.ts` | Computes liveness status and readiness diagnostics for database, Redis, and OAuth dependencies. | Service Layer |
| `src/controllers/health.controller.ts` | Handles `/health` and `/ready` HTTP requests and forwards them to `health.service.ts`. | Controller Layer |
| `src/routes/health.routes.ts` | Exposes `/health` (liveness) and `/ready` (dependency readiness). | Routing Layer |
| `src/routes/index.ts` | Aggregates sub-routers under the `/api` prefix and provides root API index metadata. | Routing Layer |

---

## 3. Frontend Architecture (`frontend/`)

| Path | Purpose | Responsibility |
| :--- | :--- | :--- |
| `package.json` | Frontend dependencies (`react`, `react-dom`, `lucide-react`, `tailwindcss`) and build scripts. | Manifest |
| `vite.config.ts` | Vite build tool configuration with React plugin and dev server port (`5173`). | Build Configuration |
| `tailwind.config.js` | Custom theme extension with brand colors (HubSpot orange shades), slate dark mode, and font stacks. | Styling Configuration |
| `postcss.config.js` | PostCSS pipeline connecting Tailwind CSS and Autoprefixer. | Build Configuration |
| `index.html` | Single Page Application entry HTML with SEO meta tags and Google Fonts Inter. | Entry Point |
| `src/main.tsx` | Mounts the React component tree into the `#root` DOM element under StrictMode. | Bootstrap |
| `src/index.css` | Global CSS with Tailwind directives, custom glassmorphism utilities, and scrollbar styling. | Global Styles |
| `src/App.tsx` | Main application shell displaying navbar, connection status, operational metrics, contacts list, and notes preview. | Layout / Application |
| `src/types/index.ts` | TypeScript domain types (`ConnectionStatus`, `SyncStatus`, `Contact`, `Note`, `AppMetrics`). | Types |
| `src/components/Navbar.tsx` | Top navigation bar with brand icon, status pills, and GitHub repository link. | UI Component |
| `src/components/Card.tsx` | Reusable glassmorphic container with optional glow effect. | UI Primitive |
| `src/components/Button.tsx` | Accessible button primitive with primary, secondary, outline, danger variants and loading spinner. | UI Primitive |
| `src/components/StatusBadge.tsx` | Pill status badge indicating connection and sync state with color-coded dot animations. | UI Primitive |
| `src/components/EmptyState.tsx` | Empty state layout with icon, descriptive title, explanation, and action slot. | UI Primitive |
| `src/components/Alert.tsx` | Alert notification box supporting info, success, warning, and error types. | UI Primitive |
| `src/components/Skeleton.tsx` | Animated pulse placeholder for loading skeletons. | UI Primitive |

---

## 4. Documentation (`docs/`)

| Path | Purpose |
| :--- | :--- |
| `docs/TECHNICAL_DESIGN.md` | Architectural principles, data flows, security decisions, and scaling strategy. |
| `docs/FILE_MAP.md` | This document: comprehensive file responsibilities and boundaries. |
| `docs/RUNBOOK.md` | Operational runbook for starting, inspecting, debugging, and troubleshooting all services. |
