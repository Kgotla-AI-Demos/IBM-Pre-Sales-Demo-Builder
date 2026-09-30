#!/usr/bin/env bash
# =============================================================================
# deploy-codengine.sh — Build & deploy the backend to IBM Cloud Code Engine
# =============================================================================
# Prerequisites:
#   - IBM Cloud CLI installed: https://cloud.ibm.com/docs/cli
#   - Code Engine plugin:  ibmcloud plugin install code-engine
#   - Container Registry plugin: ibmcloud plugin install container-registry
#   - Logged in: ibmcloud login --apikey $IBMCLOUD_API_KEY -r $CODE_ENGINE_REGION
#
# Usage:
#   export IBMCLOUD_API_KEY=...
#   export ICR_NAMESPACE=my-namespace        # IBM Container Registry namespace
#   export CODE_ENGINE_PROJECT=factory-ai-demo
#   export CODE_ENGINE_REGION=us-south
#   export CODE_ENGINE_APP_NAME=factory-ai-backend
#   export NETLIFY_DOMAIN=https://factory-ai-demo.netlify.app   # your Netlify URL
#   bash scripts/deploy-codengine.sh
# =============================================================================
set -euo pipefail

# ── Defaults (override via environment) ──────────────────────────────────────
ICR_REGION="${CODE_ENGINE_REGION:-us-south}"
ICR_REGISTRY="us.icr.io"   # Change to eu.icr.io / au.icr.io for other regions
ICR_NS="${ICR_NAMESPACE:?Set ICR_NAMESPACE to your IBM Container Registry namespace}"
CE_PROJECT="${CODE_ENGINE_PROJECT:-factory-ai-demo}"
CE_APP="${CODE_ENGINE_APP_NAME:-factory-ai-backend}"
CE_REGION="${CODE_ENGINE_REGION:-us-south}"
IMAGE="${ICR_REGISTRY}/${ICR_NS}/${CE_APP}:latest"
NETLIFY_DOMAIN="${NETLIFY_DOMAIN:-}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo "============================================================"
echo "  Factory AI Predictive Maintenance — Code Engine Deploy"
echo "  Image  : $IMAGE"
echo "  Project: $CE_PROJECT ($CE_REGION)"
echo "  App    : $CE_APP"
echo "============================================================"

# ── 1. Login ─────────────────────────────────────────────────────────────────
echo ""
echo "→ Logging in to IBM Cloud..."
ibmcloud login --apikey "${IBMCLOUD_API_KEY:?Set IBMCLOUD_API_KEY}" -r "$CE_REGION" -q

echo "→ Targeting Container Registry ($ICR_REGISTRY)..."
ibmcloud cr region-set "$ICR_REGION"
ibmcloud cr login

# ── 2. Ensure namespace exists ────────────────────────────────────────────────
ibmcloud cr namespace-add "$ICR_NS" 2>/dev/null || true

# ── 3. Build & push image ─────────────────────────────────────────────────────
echo ""
echo "→ Building Docker image (linux/amd64)..."
docker build \
  --platform linux/amd64 \
  -t "$IMAGE" \
  -f "${ROOT_DIR}/Dockerfile.backend.codeengine" \
  "$ROOT_DIR"

echo "→ Pushing image to IBM Container Registry..."
docker push "$IMAGE"

# ── 4. Code Engine — select / create project ──────────────────────────────────
echo ""
echo "→ Targeting Code Engine project: $CE_PROJECT"
ibmcloud ce project select -n "$CE_PROJECT" 2>/dev/null || \
  ibmcloud ce project create -n "$CE_PROJECT" -r "$CE_REGION"
ibmcloud ce project select -n "$CE_PROJECT"

# ── 5. Build CORS origins list ────────────────────────────────────────────────
CORS_ORIGINS="http://localhost:5173,http://localhost:3000"
if [ -n "$NETLIFY_DOMAIN" ]; then
  CORS_ORIGINS="${NETLIFY_DOMAIN},${CORS_ORIGINS}"
fi

# ── 6. Deploy or update the application ──────────────────────────────────────
echo ""
echo "→ Deploying/updating application: $CE_APP"
if ibmcloud ce application get -n "$CE_APP" &>/dev/null; then
  echo "   (application exists — updating)"
  ibmcloud ce application update \
    -n "$CE_APP" \
    --image "$IMAGE" \
    --env DEMO_MODE=mock \
    --env CORS_ORIGINS="$CORS_ORIGINS" \
    --min-scale 0 \
    --max-scale 2 \
    --cpu 0.5 \
    --memory 1G \
    --port 8080
else
  echo "   (first deploy — creating)"
  ibmcloud ce application create \
    -n "$CE_APP" \
    --image "$IMAGE" \
    --env DEMO_MODE=mock \
    --env CORS_ORIGINS="$CORS_ORIGINS" \
    --min-scale 0 \
    --max-scale 2 \
    --cpu 0.5 \
    --memory 1G \
    --port 8080
fi

# ── 7. Get the public URL ─────────────────────────────────────────────────────
echo ""
echo "→ Fetching application URL..."
APP_URL=$(ibmcloud ce application get -n "$CE_APP" --output json 2>/dev/null \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('status',{}).get('url',''))" 2>/dev/null || echo "")

echo ""
echo "============================================================"
echo "  ✅  Backend deployed!"
echo ""
if [ -n "$APP_URL" ]; then
  echo "  Backend URL : ${APP_URL}"
  echo "  Health check: ${APP_URL}/api/health"
  echo ""
  echo "  ➡  Set this as VITE_API_BASE_URL in Netlify:"
  echo "     ${APP_URL}/api"
else
  echo "  Run: ibmcloud ce application get -n $CE_APP"
  echo "  to find your backend URL, then set VITE_API_BASE_URL in Netlify."
fi
echo "============================================================"
