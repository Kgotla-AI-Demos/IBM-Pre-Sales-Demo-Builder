#!/usr/bin/env bash
# check-compliance.sh — verifies demo meets IBM Pre-Sales Demo Builder standards.
set -e
cd "$(dirname "$0")/.."
PASS=0; FAIL=0; WARN=0

flag_pass() { echo "  ✅ $1"; ((PASS++)); }
flag_fail() { echo "  ❌ $1"; ((FAIL++)); }
flag_warn() { echo "  ⚠️  $1"; ((WARN++)); }

echo "======================================================"
echo " Compliance Check — DEMO-MFG-001"
echo "======================================================"

echo ""
echo "▶ Data & Privacy"
grep -r "PII\|real.*client\|confidential" --include="*.js" --include="*.jsx" --include="*.py" --include="*.md" \
  | grep -v "No real\|no real\|synthetic\|SYNTHETIC\|disclaimer\|DemoBanner" \
  | grep -v "^Binary" && flag_warn "Possible PII reference — review manually" || flag_pass "No PII/confidential data references"

grep -r "@example\.com\|@demo\.ibm\.com" --include="*.py" frontend/src >/dev/null 2>&1 && flag_pass "Synthetic email domains used" || flag_warn "No @example.com found — verify no real emails"

echo ""
echo "▶ Security"
grep -r "WATSONX_API_KEY\s*=\s*['\"][a-z0-9]" --include="*.py" --include="*.env" . 2>/dev/null \
  && flag_fail "Hardcoded API key detected!" || flag_pass "No hardcoded API keys"

[ -f .env ] && grep -q "^WATSONX_API_KEY=\S" .env \
  && flag_warn ".env contains a credential — ensure it is gitignored" || flag_pass ".env has no populated secrets"

grep -r "eval(" --include="*.js" --include="*.jsx" . 2>/dev/null \
  | grep -v "node_modules" && flag_fail "eval() usage detected" || flag_pass "No eval() usage"

echo ""
echo "▶ IBM Design Standards"
grep -q '"@carbon/react"' frontend/package.json && flag_pass "@carbon/react v11 declared in package.json" || flag_fail "@carbon/react missing from package.json"
grep -q "Built with IBM watsonx" frontend/src/components/DemoBanner.jsx 2>/dev/null && flag_pass "DemoBanner present with IBM branding" || flag_fail "DemoBanner missing or lacks IBM branding"
grep -rq "Powered by Watson" --include="*.jsx" --include="*.js" . 2>/dev/null && flag_fail "Outdated 'Powered by Watson' branding found" || flag_pass "No outdated Watson branding"

echo ""
echo "▶ Documentation"
for f in README.md ARCHITECTURE.md PILOT_PLAN.md DEMO_SCRIPT.md; do
  [ -f "$f" ] && flag_pass "$f exists" || flag_fail "$f missing"
done

echo ""
echo "▶ Docker / Container Compliance"
for df in Dockerfile.frontend Dockerfile.backend; do
  if [ -f "$df" ]; then
    DEPLOY_TARGET=$(grep "^# DEPLOY_TARGET:" "$df" | awk '{print $3}')
    BUILD_ARCH=$(grep "^# BUILD_ARCH:" "$df" | awk '{print $3}')
    if [ -z "$DEPLOY_TARGET" ]; then
      flag_fail "$df: missing # DEPLOY_TARGET header — HARD FAIL"
    else
      flag_pass "$df: DEPLOY_TARGET=$DEPLOY_TARGET"
    fi
    if [ "$DEPLOY_TARGET" = "openshift" ]; then
      grep -q "ubi9/" "$df" && flag_pass "$df: uses UBI 9 base image" || flag_fail "$df: DEPLOY_TARGET=openshift but no UBI 9 base image — HARD FAIL"
      grep -q "alpine\|slim" "$df" && flag_fail "$df: alpine/slim detected for OpenShift — HARD FAIL" || true
    fi
  else
    flag_warn "$df not found — containerization deferred"
  fi
done

echo ""
echo "▶ .gitignore"
[ -f .gitignore ] && grep -q "\.env$" .gitignore && flag_pass ".env gitignored" || flag_warn ".gitignore missing or .env not excluded"

echo ""
echo "======================================================"
echo " Results: $PASS passed · $FAIL failed · $WARN warnings"
echo "======================================================"
[ $FAIL -eq 0 ] && echo "✅ Compliance check passed" && exit 0
echo "❌ Compliance failures detected" && exit 1
