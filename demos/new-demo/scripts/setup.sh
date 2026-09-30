#!/usr/bin/env bash
# setup.sh — first-time setup for the Factory AI Predictive Maintenance demo
set -e
cd "$(dirname "$0")/.."

echo "======================================================"
echo " Factory AI Predictive Maintenance — Demo Setup"
echo " Built with IBM watsonx"
echo "======================================================"

# Env file
if [ ! -f .env ]; then
  cp .env.example .env
  echo "✅ .env created from .env.example"
else
  echo "ℹ️  .env already exists — skipping copy"
fi

# Check Node
if ! command -v node &>/dev/null; then
  echo "❌ Node.js not found. Install from https://nodejs.org (v20 LTS recommended)"
  exit 1
fi
echo "✅ Node.js $(node --version)"

# Frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
npm ci || npm install
cd ..
echo "✅ Frontend dependencies installed"

# Check Python
PYTHON_CMD=""
for cmd in python3 python py; do
  if command -v "$cmd" &>/dev/null; then
    PYTHON_CMD="$cmd"
    break
  fi
done
if [ -z "$PYTHON_CMD" ]; then
  echo "❌ Python 3.11+ not found. Install from https://python.org"
  exit 1
fi
echo "✅ Python: $($PYTHON_CMD --version)"

# Backend virtualenv
echo ""
echo "🐍 Setting up Python virtual environment..."
cd backend
$PYTHON_CMD -m venv .venv
if [ -f .venv/Scripts/activate ]; then
  source .venv/Scripts/activate  # Windows
else
  source .venv/bin/activate       # Unix
fi
pip install --quiet -r requirements.txt
cd ..
echo "✅ Backend dependencies installed"

echo ""
echo "======================================================"
echo " Setup complete! To run the demo:"
echo ""
echo "  Terminal 1 (backend):"
echo "    cd backend && source .venv/bin/activate && uvicorn main:app --reload"
echo ""
echo "  Terminal 2 (frontend):"
echo "    cd frontend && npm run dev"
echo ""
echo "  Open: http://localhost:5173"
echo "======================================================"
