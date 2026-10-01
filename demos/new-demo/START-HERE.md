# 🚀 Run the Demo — No Installs Needed

> All you need is a **GitHub account** (to push the code) and a **Google account** (for Colab).
> Everything runs in the cloud. Nothing installs on your computer.

---

## One-time setup (~5 minutes total)

### Step 1 — Push the latest code to GitHub (1 min)

Your repo is **already connected** to GitHub. Just push the latest changes:

1. Open **Git Bash** (search "Git Bash" in the Start menu)
2. Run:

```bash
cd "C:\Users\User\Downloads\IBM-Pre-Sales-Demo-Builder"
git add demos/new-demo/
git commit -m "Update demo notebook"
git push
```

> Repo: **https://github.com/Kgotla-AI-Demos/IBM-Pre-Sales-Demo-Builder**

---

### Step 2 — Open the Colab notebook (30 sec)

1. Go to **https://colab.research.google.com**
2. Click **File → Open notebook → GitHub**
3. Paste: `https://github.com/Kgotla-AI-Demos/IBM-Pre-Sales-Demo-Builder`
4. Find **`demos/new-demo/deploy-to-netlify.ipynb`** → open it

---

### Step 3 — Run all cells (~4 minutes)

1. Click **Runtime → Run all** (`Ctrl+F9`)
2. Wait ~4 minutes for all cells to finish
3. **Cell 4** prints a URL like:

```
=================================================================
  ✅  YOUR DEMO IS LIVE

  🌐  https://xyz.trycloudflare.com

  Click the link above — the demo opens in your browser.
=================================================================
```

4. Click that link — the full demo loads in your browser ✅

---

## That's it — no Netlify, no extra accounts

The demo runs entirely inside Colab:
- **Backend** (FastAPI + IBM watsonx mock) runs on the Colab VM
- **Frontend** (React app) is built and served from the same VM
- **Cloudflare Tunnel** gives you a free public HTTPS URL instantly

Share the URL with anyone. Works on any device, any browser, no login required.

---

## Every time after that

When the Colab session expires (~12 hours of inactivity):
1. Reopen the notebook in Colab
2. Click **Runtime → Run all** again
3. Wait ~2 min (uses npm & pip caches)
4. Cell 4 prints a new URL — use that

---

## Troubleshooting

| Problem | Fix |
|---|---|
| "git not found" | Use Git Bash app (search "Git Bash" in Start menu) |
| Cell 4 shows ❌ "Could not get tunnel URL" | Re-run Cell 4 |
| Page loads but shows no data | Re-run Cell 4 (backend may have crashed) |
| All checks ❌ in Cell 5 | Re-run Cells 2–4 in order |
| Want live IBM watsonx.ai | In Cell 4, set `DEMO_MODE=live` and add your API key |

---

*Built with IBM watsonx · DEMO-MFG-001 · IBM Pre-Sales Demo Builder*
