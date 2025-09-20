# Astro + Starlight on Cloudflare Pages (with GitHub & GitHub Actions)
**Authoring-friendly static docs site** with Markdown, CI/CD from GitHub, and production hosting on Cloudflare Pages. Includes ready-to-paste configs and **Codex CLI** prompts to speed up implementation.

> TL;DR: Scaffold Astro Starlight → push to GitHub → deploy to Cloudflare Pages via **Direct Upload** from **GitHub Actions** (Wrangler).

---

## 0) Goals & Non‑Goals
- **Goals:** Static site (FAQ, links, docs) with simple authoring (Markdown), fast global CDN, preview deploys per PR, custom domain + HTTPS, zero servers.
- **Non‑Goals:** Server-side features (booking, DB). If needed later, add Pages Functions under a plan that fits demand.

---

## 1) Architecture Overview
- **Framework:** Astro + Starlight (docs theme; minimal JS).
- **Source control:** GitHub (PRs → preview deploys).
- **CI/CD:** GitHub Actions builds; **Wrangler Direct Upload** to Cloudflare Pages.
- **Hosting:** Cloudflare Pages (static; unlimited traffic for assets on Free).

**Key docs:** 
- Astro → Cloudflare Pages guide.  
- Cloudflare Pages Direct Upload with GitHub Actions.  
- Cloudflare Pages preview deployments (per-PR).

---

## 2) Tooling & Versions
- Node.js LTS (≥ 20). Add `.nvmrc` or `.node-version` with `20`.
- PNPM or NPM (examples show NPM).
- Astro `^4`, Starlight `^0.26` (or latest at setup time).
- Wrangler `^3` (installed in CI).

```bash
# local
node -v   # expect v20+
npm -v
```

---

## 3) Repository Layout
```
astro-starlight-site/
├─ src/
│  ├─ content/docs/            # Markdown pages
│  │  ├─ index.md
│  │  ├─ contacts.md
│  │  ├─ infrastructure.md
│  │  ├─ charity.md
│  │  ├─ docs.md
│  │  └─ faq.md
│  └─ assets/                  # images, logos
├─ public/                     # static files (favicon.ico, robots.txt, _redirects, _headers)
├─ astro.config.mjs
├─ starlight.config.mjs
├─ package.json
├─ .gitignore
├─ .editorconfig
├─ .nvmrc                      # 20
├─ wrangler.toml
└─ .github/workflows/deploy.yml
```

---

## 4) Bootstrap the Project
```bash
# 1) Scaffold
npm create astro@latest astro-starlight-site -- --template starlight
cd astro-starlight-site
npm install

# 2) Dev
npm run dev

# 3) Git
git init
git add -A
git commit -m "feat: scaffold Astro Starlight"
```

---

## 5) Starlight Configuration
**`astro.config.mjs`**
```js
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://example.org',  // set to your prod domain later
  integrations: [
    starlight({
      title: 'Італійський квартал',
      locales: { root: { label: 'Українська', lang: 'uk' } },
      sidebar: [
        { label: 'Головна', link: '/' },
        { label: 'Контакти', link: '/contacts/' },
        { label: 'Інфраструктура', link: '/infrastructure/' },
        { label: 'Благодійність', link: '/charity/' },
        { label: 'Документація', link: '/docs/' },
        { label: 'FAQ', link: '/faq/' }
      ],
      social: {
        // Add Telegram/Email links if desired
      },
      favicon: '/favicon.ico'
    })
  ]
});
```

**Pages (Markdown)** — add/update under `src/content/docs/` (see examples you already got earlier).

---

## 6) Static Routing & Headers (optional but recommended)
**`public/_redirects`** (only if you need path fixes; not required for Starlight)
```
# Redirect legacy paths to new docs
/old-faq   /faq  301
```

**`public/_headers`** (basic security headers; adjust as needed)
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
```

---

## 7) Build Scripts
**`package.json`**
```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "lint:links": "npx linkinator dist --recurse --retry 2"
  }
}
```

**Local test**
```bash
npm run build
npm run preview
```

---

## 8) Cloudflare Pages via GitHub Actions (Direct Upload)
> We deploy from CI instead of connecting the repo in the dashboard—useful for monorepos, custom build steps, or keeping control in GitHub.

### 8.1 Create a Pages project (one-time)
- Go to **Cloudflare Dashboard → Workers & Pages → Pages → Create → Direct Upload**.
- Name the project (e.g., `ik-site`). This creates the project shell (no prod deploy yet).

### 8.2 Create API Token & Account ID
- **Account ID:** Cloudflare Dashboard → **Workers & Pages** → right panel shows **Account ID**.
- **API Token:** Create a token with **Pages:Edit**, **Pages:Read**, **Workers Scripts:Read**, **Account Settings:Read** (or use the “Edit Cloudflare Pages” template). Store in GitHub Secrets.

In GitHub repo **Settings → Secrets and variables → Actions**, add:
- `CLOUDFLARE_ACCOUNT_ID` = `<your id>`
- `CLOUDFLARE_API_TOKEN`  = `<your token>`
- `CLOUDFLARE_PROJECT_NAME` = `ik-site` (the Pages project name)

### 8.3 Wrangler config (for Pages)
**`wrangler.toml`**
```toml
name = "ik-site-deploy"
account_id = "${CLOUDFLARE_ACCOUNT_ID}"

[pages]
project_name = "${CLOUDFLARE_PROJECT_NAME}"
# Optional: production_branch = "main"
```

### 8.4 GitHub Actions workflow
**`.github/workflows/deploy.yml`**
```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [ "main" ]
  pull_request:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write
      id-token: write    # for OIDC if you switch off API token later
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install deps
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact (Preview/PRs)
        if: ${{ github.event_name == 'pull_request' }}
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: ${{ secrets.CLOUDFLARE_PROJECT_NAME }}
          directory: ./dist
          # Creates a unique preview for each PR
          branch: ${{ github.head_ref }}

      - name: Upload artifact (Production)
        if: ${{ github.event_name == 'push' && github.ref == 'refs/heads/main' }}
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: ${{ secrets.CLOUDFLARE_PROJECT_NAME }}
          directory: ./dist
          branch: main
```

> Notes:
> - The official method is **Direct Upload** via Wrangler/Pages Action from CI; this yields *Preview Deployments* for PRs and publishes to Production on `main`.
> - If you prefer Cloudflare’s Git integration instead of Actions, you can connect the repo in the dashboard and skip this workflow. Both approaches are supported.

---

## 9) Custom Domain & TLS
- In Pages project → **Settings → Domains**: add your domain or subdomain.
- Ensure your DNS is on Cloudflare (nameservers) or set CNAME to the Pages hostname.
- TLS is auto-managed by Cloudflare (Universal SSL).

---

## 10) Caching & Performance
- Astro emits hashed assets → long-lived caching by default.
- Keep HTML cache short (CF defaults are OK). For heavy images, consider the **Images** product later.

---

## 11) Monitoring & Preview Discipline
- Each PR auto-creates a **Preview Deployment** (link in PR checks). Share with reviewers.
- Enable **Web Analytics** (Privacy-first) or use a consented third-party if needed.

---

## 12) Content Workflow
- Add/edit Markdown in `src/content/docs` → open PR → preview link → merge to main → auto-production deploy.
- Optional: add a Git-based CMS (Decap/Tina) later; both operate on Markdown files in Git.

---

## 13) Using **Codex CLI** for Speed
Install **Codex CLI** and let it make the edits and run commands under your supervision.

### 13.1 Install
```bash
# macOS (Homebrew)
brew install codex

# or npm
npm i -g @openai/codex
```

### 13.2 First run
```bash
codex init   # creates ~/.codex/config.toml
codex help
```

### 13.3 Project-setup prompts (copy/paste)
From repo root, you can ask Codex to scaffold and wire steps:

```text
Codex, in this repo:
1) Create Starlight content pages (contacts, infrastructure, charity, docs, faq) with initial Ukrainian text placeholders.
2) Update astro.config.mjs with Ukrainian locale, sidebar, and site title "Італійський квартал".
3) Add public/_headers with basic security headers and public/_redirects with example rule from /old-faq to /faq (301).
4) Add .nvmrc with "20", .editorconfig with 2-space indent.
5) Create wrangler.toml with pages.project_name env var placeholders.
6) Add .github/workflows/deploy.yml that builds on PR & main and deploys to Cloudflare Pages with preview links.
7) Run `npm i` and `npm run build` to ensure the project builds.
```

For maintenance tasks:
```text
Codex, update the FAQ page:
- Add section on waste sorting (bullet list).
- Add "How to book the gazebo" steps referencing our Telegram bot link.
Also compress images in src/assets to webp where safe, update references.
```

Safety tips:
- Codex proposes changes; **review diffs** before committing.
- Keep CI secrets in GitHub, not in code.
- Pin Node version and lockfile to keep builds reproducible.

---

## 14) Troubleshooting
- **Build passes locally, fails on CF:** ensure Node 20 in CI; clear lockfile issues with `npm ci`.
- **404s on pretty URLs:** Starlight renders static routes; if you add SPA pages later, use `_redirects` or fallback handler.
- **Large assets (>25 MiB):** store in R2 or external CDN and link.

---

## 15) Future Enhancements
- Add **Decap CMS** for web editing (`/admin/`), GitHub OAuth app.
- Add **sitemap.xml**, **robots.txt** (place in `public/`).
- Add **search**: Starlight supports local search; for larger docs, consider Algolia DocSearch.

---

## Appendix A: Copy‑paste files

### A1) `.editorconfig`
```
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
```

### A2) `.nvmrc`
```
20
```

### A3) `wrangler.toml`
```toml
name = "ik-site-deploy"
account_id = "${CLOUDFLARE_ACCOUNT_ID}"

[pages]
project_name = "${CLOUDFLARE_PROJECT_NAME}"
```

### A4) `.github/workflows/deploy.yml`
```yaml
name: Deploy to Cloudflare Pages
on:
  push:
    branches: [ "main" ]
  pull_request:
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - if: ${{ github.event_name == 'pull_request' }}
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: ${{ secrets.CLOUDFLARE_PROJECT_NAME }}
          directory: ./dist
          branch: ${{ github.head_ref }}
      - if: ${{ github.event_name == 'push' && github.ref == 'refs/heads/main' }}
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: ${{ secrets.CLOUDFLARE_PROJECT_NAME }}
          directory: ./dist
          branch: main
```

### A5) `public/_headers`
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
```

---

## License
You can copy/paste and adapt this plan freely for your project.
