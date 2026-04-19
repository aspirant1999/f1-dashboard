# Pit Wall — Personalized F1 2026 Dashboard

A shareable, personalized Formula 1 2026 season dashboard. Each visitor picks their favorite driver and team, and the entire dashboard re-themes around their choices.

## 🚀 Deploy to GitHub Pages (10 minutes)

### Step 1 — Create a GitHub repo

1. Go to [github.com/new](https://github.com/new)
2. Name it **`f1-dashboard`** (important: must match the `base` path in `vite.config.js`)
3. Set it to **Public**
4. Do **not** initialize with README/gitignore (we have our own)
5. Click **Create repository**

### Step 2 — Upload this project

**Option A: Drag & drop (easiest, no terminal)**

1. On the empty repo page, click **uploading an existing file**
2. Drag the entire contents of this folder into the browser (not the folder itself — its contents)
3. Scroll down, click **Commit changes**

**Option B: Git command line**

```bash
cd f1-dashboard
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/f1-dashboard.git
git push -u origin main
```

### Step 3 — Enable GitHub Pages

1. In your repo, go to **Settings → Pages** (left sidebar)
2. Under **Build and deployment**, change **Source** to **GitHub Actions**
3. Done. No other settings needed.

### Step 4 — Wait for deploy (~2 minutes)

1. Go to the **Actions** tab in your repo
2. You'll see a workflow called **Deploy to GitHub Pages** running
3. When it finishes (green checkmark), your site is live at:

   **`https://YOUR_USERNAME.github.io/f1-dashboard/`**

Share that link with friends. Every push to `main` auto-redeploys.

---

## 🛠 Running Locally (optional)

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

---

## ⚠️ Using a different repo name?

If you name your repo something other than `f1-dashboard` (e.g. `my-f1-site`), you **must** update one line in `vite.config.js`:

```js
base: '/my-f1-site/',   // ← must match your repo name, with leading and trailing slash
```

Otherwise the CSS and JS won't load on the live site.

---

## 📦 What's inside

- **Vite + React 18** — fast dev server, clean production builds
- **Tailwind CSS** — utility-first styling (all classes you see in `App.jsx`)
- **localStorage** — each visitor's picks save in their own browser
- **GitHub Actions** — auto-deploys on every push to `main`

---

## 🏁 Season data — now live!

Standings, results, and race counts are fetched live from the [Jolpica F1 API](https://jolpi.ca/) (a free Ergast successor) every time someone opens the dashboard. **You don't need to update anything after each race** — the data refreshes automatically.

If the API is ever unreachable, the dashboard silently falls back to hardcoded data so it never breaks. A status indicator in the top-right shows whether you're seeing live or offline data.

The 2026 race calendar and team metadata (colors, HQ, engine suppliers, founding year) are still hardcoded in `src/App.jsx` — those don't change.

### Contributing data fixes

If something looks off (e.g. a driver showing the wrong team), it's probably the mapping in the `CONSTRUCTOR_ID_TO_TEAM` or `DRIVER_ID_TO_CODE` objects near the top of `App.jsx`. Edit, commit, push.
