# DialNext HubSpot — Operational Runbook

This operational runbook provides step-by-step procedures for local development, inspecting service health, verifying logs, and troubleshooting issues.

---

## 1. Local Development Environment

### 1.1 Running the Backend API Server
Navigate to the `backend/` directory:
```powershell
cd backend
npm install
npm run typecheck
npm run dev
```
- Development server starts with auto-reload (`tsx watch`) on port `5000`.
- Verify liveness:
  ```powershell
  curl http://localhost:5000/health
  ```
  Expected output:
  ```json
  {"status":"ok"}
  ```
- Verify API status:
  ```powershell
  curl http://localhost:5000/api/health
  ```
  Expected output:
  ```json
  {"success":true,"data":{"status":"ok","uptimeSeconds":12,"environment":"development","version":"1.0.0"}}
  ```

### 1.2 Running the Frontend Client
In a separate terminal, navigate to the `frontend/` directory:
```powershell
cd frontend
npm install
npm run typecheck
npm run dev
```
- The Vite development server starts on `http://localhost:5173`.
- Open `http://localhost:5173` in your browser to interact with the UI.

---

## 2. Health & Readiness Diagnostics

### 2.1 Liveness Probe (`GET /health`)
- Used by cloud platforms (Render, Kubernetes, load balancers) to confirm whether the process is alive.
- Returns HTTP `200` with `{"status":"ok"}`.

### 2.2 Readiness Probe (`GET /api/ready`)
- Checks connectivity to downstream dependencies (PostgreSQL database and Redis queue).
- If all dependencies are healthy, returns HTTP `200`.
- If any required dependency is unavailable or unconfigured, returns HTTP `503 Service Unavailable` with details on which subsystem is degraded.

---

## 3. Troubleshooting & Common Scenarios

### 3.1 Port Already in Use (EADDRINUSE)
- **Symptom:** Backend fails to start with `Error: listen EADDRINUSE: address already in use :::5000`.
- **Solution:** Another process is occupying port 5000. In PowerShell, find and terminate the process or change `PORT=5001` in `backend/.env`:
  ```powershell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
  ```

### 3.2 Environment Variable Validation Failure
- **Symptom:** Backend process exits immediately on start with `Environment validation failed on startup`.
- **Solution:** Check the terminal output for the exact key that failed validation (e.g., malformed `PORT` or invalid URL). Ensure `backend/.env` adheres to `backend/.env.example`.

### 3.3 CORS Errors in Frontend Console
- **Symptom:** Browser shows `Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource`.
- **Solution:** Ensure `CLIENT_URL` in `backend/.env` matches the exact frontend origin (`http://localhost:5173`).
