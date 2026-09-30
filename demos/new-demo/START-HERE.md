# 🚀 Deploy the Demo — No Installs Needed

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
git commit -m "Add Colab deploy notebook"
git push
```

> Repo: **https://github.com/Kgotla-AI-Demos/IBM-Pre-Sales-Demo-Builder**

---

### Step 2 — Sign up for Netlify (1 min, free)

Go to **https://netlify.com** → **Sign up** → use your GitHub account.
No credit card. Free tier is enough.

---

### Step 3 — Open the Colab notebook (2 min)

1. Go to **https://colab.research.google.com**
2. Click **File → Open notebook → GitHub**
3. Paste your GitHub repo URL → find **`demos/new-demo/deploy-to-netlify.ipynb`** → open it
4. Click **Runtime → Run all** (`Ctrl+F9`)
5. When it asks you to log in to Netlify — follow the link, paste the code back
6. Wait ~3 minutes → you get a **live public URL** ✅

---

## That's it — your demo is live

Share the Netlify URL with anyone. It works on any device, any browser, no login required.

---

## Every time after that

When your Colab session expires (~12 hours):
1. Reopen the notebook
2. Run **Cells 3 → 4 → 5 → 6** (takes ~2 min)
3. Same Netlify URL, new backend tunnel

---

## Troubleshooting

| Problem | Fix |
|---|---|
| "git not found" | Git Bash is at `C:\Users\User\AppData\Local\Programs\Git\cmd\git.exe` — use Git Bash app |
| Netlify login doesn't work | Make sure you're logged into `netlify.com` in the browser first |
| Backend shows error | Re-run Cell 4 in the notebook to restart the tunnel |
| Page loads but no data | The Colab session expired — re-run Cells 3–6 |

---

*Built with IBM watsonx · DEMO-MFG-001*
