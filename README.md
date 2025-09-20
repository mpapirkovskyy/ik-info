# Italian Quarter – Community Docs

Static documentation site for the “Італійський квартал” residential community, built with Astro + Starlight. Content lives in Markdown so every pull request can be previewed on Cloudflare Pages before release.

## Project Layout
- `src/content/docs/` – community-facing pages (Ukrainian content by design).
- `docs/design/initial_plan.md` – implementation blueprint and decisions.
- `docs/work/` – vertical-slice task briefs leading to the MVP.
- `public/` – static assets such as the favicon, redirects, headers.

## Local Development
1. Use Node.js 20 (follow `.nvmrc` with `nvm use` if available).
2. Install dependencies: `npm install`.
3. Start the dev server: `npm run dev` (http://localhost:4321).
4. Validate before pushing: `ASTRO_TELEMETRY_DISABLED=1 npm run build`.

## Continuous Deployment (Cloudflare Pages)
- GitHub Actions workflow: `.github/workflows/deploy.yml` builds with Node 20 and uploads via `cloudflare/pages-action@v1`.
- Required GitHub secrets:
  - `CLOUDFLARE_API_TOKEN`
  - `CLOUDFLARE_ACCOUNT_ID`
  - `CLOUDFLARE_PROJECT_NAME`
- Pull requests trigger preview deploys; pushes to `main` promote to production.
- `wrangler.toml` declares the project and reads sensitive values from secrets/environment, so do not hard-code credentials.

## References
- Live community booking site: https://ik-booking.easyweek.com.ua/
- Astro documentation: https://docs.astro.build/
- Starlight documentation: https://starlight.astro.build/
