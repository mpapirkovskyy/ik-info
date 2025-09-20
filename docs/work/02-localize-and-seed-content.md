# Task 02 – Localize navigation and seed core docs

## Objective
Apply the "Італійський квартал" branding, Ukrainian locale, and seed the six core Markdown pages so visitors can navigate a usable MVP locally.

## Scope
- Update `astro.config.mjs` (or `starlight.config.mjs` if present) with the Ukrainian locale, sidebar items, site title, and favicon path from the main plan.
- Create Markdown files under `src/content/docs/` for `index`, `contacts`, `infrastructure`, `charity`, `docs`, and `faq`, each with placeholder frontmatter and short Ukrainian copy.
- Add any required assets referenced in the pages (e.g., favicon) to `public/`.

## Exclusions
- No advanced styling, data fetching, or CMS wiring.
- No Cloudflare-specific headers/redirects yet.

## Steps
1. Start from the scaffolded project (Task 01) on a fresh branch.
2. Edit the Starlight config to set the locale (`lang: 'uk'`), root label, sidebar entries, and site title "Італійський квартал".
3. Author the Markdown pages with concise sections (headings, bullet lists) that match the sidebar labels.
4. Place a favicon in `public/` and confirm the config points to it.
5. Run `npm run build` and `npm run preview` to manually validate navigation and page rendering.
6. Commit the changes with message `feat: add localized docs skeleton`.

## Definition of Done
- Navigating the site locally shows Ukrainian labels and working links for all six pages.
- Each Markdown file renders without build-time warnings.
- The favicon loads in the browser preview.
- All changes are committed and ready for review.

## Verification checklist
- Screenshot or short screen recording of the sidebar with Ukrainian labels attached to the PR.
- Output from `npm run build` showing success, copied into the PR description.
