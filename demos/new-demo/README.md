# Factory AI Predictive Maintenance Demo
## Built with IBM watsonx — DEMO-MFG-001

> **Disclaimer:** All data is synthetic. No real client data, PII, or confidential information is used.

A fully-functional IBM Pre-Sales demo showcasing **AI-powered predictive maintenance** for manufacturing. IBM watsonx AI monitors IoT sensor data from 120 synthetic factory assets, predicts failures 7–14 days in advance, and automatically generates maintenance work orders with recommended parts and technicians.

---

## 🚀 Quick Start (Local — Recommended)

### Prerequisites
- **Python 3.11+** — [python.org](https://python.org)
- **Node.js 20 LTS** — [nodejs.org](https://nodejs.org)

### 1 — First-time setup
```bash
cd demos/new-demo
bash scripts/setup.sh
```

### 2 — Start the backend
```bash
cd backend
source .venv/bin/activate     # Windows: .venv\Scripts\activate
uvicorn main:app --reload --port 8000
```
Health check: http://localhost:8000/api/health

### 3 — Start the frontend (new terminal)
```bash
cd frontend
npm run dev
```
Open: **http://localhost:5173**

---

## 📁 Project Structure

```
demos/new-demo/
├── backend/                    Python FastAPI backend
│   ├── main.py                 Entry point
│   ├── config.py               Pydantic settings
│   ├── requirements.txt        Python dependencies
│   ├── routers/                API routes (health, data, ai, demo)
│   └── services/
│       ├── synthetic_data_service.py   120 synthetic assets, 30 work orders
│       └── watsonx_service.py          Dual-mode: mock + live IBM watsonx.ai
├── frontend/                   React + Carbon Design System v11
│   └── src/
│       ├── pages/              5 pages: Dashboard, Problem, AI Agent, Results, Architecture
│       ├── components/         DemoBanner, KPICard, AIResponsePanel, DataTableView
│       └── services/           API client + watsonx service
├── scripts/
│   ├── setup.sh                First-time setup
│   ├── verify-demo.sh          CI smoke test
│   └── check-compliance.sh     IBM standards check
├── Dockerfile.frontend         UBI 9 — OpenShift ready
├── Dockerfile.backend          UBI 9 — OpenShift ready
├── docker-compose.yml          Local container stack
└── .env.example                Environment variable template
```

---

## ⚙️ Configuration

Copy `.env.example` → `.env` and fill in values:

| Variable | Description | Default |
|---|---|---|
| `DEMO_MODE` | `mock` (no creds needed) or `live` | `mock` |
| `WATSONX_API_KEY` | IBM Cloud API key | *(blank — mock mode)* |
| `WATSONX_PROJECT_ID` | watsonx.ai project ID | *(blank — mock mode)* |
| `WATSONX_URL` | watsonx.ai endpoint | `https://us-south.ml.cloud.ibm.com` |
| `WATSONX_MODEL_ID` | LLM model ID | `meta-llama/llama-4-maverick-17b-128e-instruct-fp8` |

### Live mode (IBM watsonx.ai)
1. Uncomment `ibm-watsonx-ai` in `backend/requirements.txt` and `pip install`
2. Add your `WATSONX_API_KEY`, `WATSONX_PROJECT_ID`, `WATSONX_URL` to `.env`
3. Set `DEMO_MODE=live`

---

## 🐳 Container Deployment (OpenShift)

**DEPLOY_TARGET: openshift | BUILD_ARCH: amd64**

```bash
docker build --platform linux/amd64 -t factory-ai-frontend -f Dockerfile.frontend .
docker build --platform linux/amd64 -t factory-ai-backend  -f Dockerfile.backend .
docker-compose up
```

> UBI 9 base images are required for OpenShift's restricted SCC (random UID). Alpine/slim will fail.

---

## 🎯 Demo Flow (15-minute presentation)

| Time | Section | What to show |
|---|---|---|
| 0–2 min | **Dashboard** | Fleet health KPIs, sensor trend, alert table |
| 2–5 min | **Problem** | $3.2M annual downtime cost, reactive maintenance timeline |
| 5–12 min | **AI Agent** | Select Scenario 1, click Run Agent, show work order |
| 12–14 min | **Results** | 68% downtime reduction, OEE +12.8pts, $1.24M savings |
| 14–15 min | **Architecture** | System diagram, "let's do a 3-week pilot" |

---

## 🔬 API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | GET | Health check + mode |
| `/api/data/dashboard` | GET | KPIs + charts + alerts |
| `/api/data/equipment` | GET | Equipment fleet (paginated) |
| `/api/data/work-orders` | GET | Work orders (paginated) |
| `/api/data/analytics` | GET | Before/after metrics |
| `/api/ai/analyze` | POST | AI analysis + work order |
| `/api/ai/models` | GET | Available models |

Interactive docs: http://localhost:8000/docs

---

## ✅ Compliance

Run before any client presentation:
```bash
bash scripts/check-compliance.sh
```

---

*Built with IBM watsonx · DEMO-MFG-001 · IBM Pre-Sales Demo Builder*
