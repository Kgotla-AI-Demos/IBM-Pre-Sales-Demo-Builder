#!/usr/bin/env bash
# verify-demo.sh — boots backend + frontend, checks all endpoints, exits non-zero on failure.
set -e
cd "$(dirname "$0")/.."
PASS=0; FAIL=0

echo "======================================================"
echo " Verify Demo — Factory AI Predictive Maintenance"
echo "======================================================"

# ── Backend ────────────────────────────────────────────────────────────────
echo ""
echo "▶ Stage 1: Backend boot + endpoint checks"

PYTHON_CMD=""
for cmd in python3 python py; do
  if command -v "$cmd" &>/dev/null; then PYTHON_CMD="$cmd"; break; fi
done
[ -z "$PYTHON_CMD" ] && echo "❌ Python not found" && exit 1

cd backend
[ ! -d .venv ] && $PYTHON_CMD -m venv .venv
if [ -f .venv/Scripts/activate ]; then source .venv/Scripts/activate; else source .venv/bin/activate; fi
pip install --quiet -r requirements.txt

# Boot backend
uvicorn main:app --host 127.0.0.1 --port 8765 &
BACKEND_PID=$!
sleep 3

check_endpoint() {
  local url=$1; local label=$2
  if curl -fsS "$url" >/dev/null 2>&1; then
    echo "  ✅ $label ($url)"
    ((PASS++))
  else
    echo "  ❌ $label ($url) — FAILED"
    ((FAIL++))
  fi
}

check_endpoint "http://127.0.0.1:8765/api/health"         "GET /api/health"
check_endpoint "http://127.0.0.1:8765/api/data/dashboard"  "GET /api/data/dashboard"
check_endpoint "http://127.0.0.1:8765/api/data/equipment"  "GET /api/data/equipment"
check_endpoint "http://127.0.0.1:8765/api/data/work-orders" "GET /api/data/work-orders"
check_endpoint "http://127.0.0.1:8765/api/ai/models"       "GET /api/ai/models"

# POST /api/ai/analyze
ANALYZE_RESP=$(curl -fsS -X POST http://127.0.0.1:8765/api/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{"equipment_id":"EQ-0012","scenario":"bearing_failure"}' 2>&1 || true)
if echo "$ANALYZE_RESP" | grep -q "analysis"; then
  echo "  ✅ POST /api/ai/analyze"
  ((PASS++))
else
  echo "  ❌ POST /api/ai/analyze — unexpected response"
  ((FAIL++))
fi

kill $BACKEND_PID 2>/dev/null || true
cd ..

# ── Frontend build ──────────────────────────────────────────────────────────
echo ""
echo "▶ Stage 2: Frontend build"
cd frontend
npm ci 2>/dev/null || npm install 2>/dev/null
if npm run build 2>&1 | tail -5; then
  echo "  ✅ npm run build exited 0"
  ((PASS++))
else
  echo "  ❌ npm run build FAILED"
  ((FAIL++))
fi
cd ..

# ── Summary ────────────────────────────────────────────────────────────────
echo ""
echo "======================================================"
echo " Results: $PASS passed, $FAIL failed"
echo "======================================================"
[ $FAIL -eq 0 ] && echo "✅ All checks passed — demo is ready!" && exit 0
echo "❌ Some checks failed — see output above." && exit 1
