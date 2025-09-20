# Repository Guidelines

## Project Structure & Module Organization
- `docs/design/initial_plan.md` captures the end-to-end implementation plan and should be updated when architectural decisions change.
- `docs/work/` holds sequenced vertical-slice task briefs (`01-`, `02-`, …); add new slices rather than editing history unless requirements shift.
- Application source will live at the repository root once the Astro Starlight scaffold (Task 01) lands (`src/`, `public/`, `astro.config.mjs`). Keep infrastructure files (`wrangler.toml`, `.github/workflows/`) beside the scaffold.

## Build, Test, and Development Commands
- `npm install` – install dependencies for the Astro project once it is generated.
- `npm run dev` – start the local dev server at `http://localhost:4321` for manual verification.
- `npm run build` – produce the static site in `dist/`; required before opening a pull request.
- `npm run preview` – serve the built artifacts to validate production output.

## Coding Style & Naming Conventions
- Follow `.editorconfig`: UTF-8, LF endings, two-space indentation, trailing newline, no trailing whitespace.
- Use PascalCase for Astro components, kebab-case for content file names (`faq.md`), and lowercase hyphenated directories (`src/content/docs`).
- Commit infrastructure secrets to GitHub via repository settings only; reference them as `${{ secrets.NAME }}` in workflows.

## Testing Guidelines
- Automated tests are not yet configured; for each feature, add reproduction steps or screenshots in the PR description.
- When adding tests later, colocate them under `src/tests/` and name files `<feature>.test.(js|ts)`.
- Always run `npm run build` locally; failures block merges.

## Commit & Pull Request Guidelines
- Use conventional-style messages (e.g., `feat: add localized docs skeleton`, `ci: add Cloudflare Pages pipeline`). Limit subject lines to 72 characters.
- Include a concise PR description covering scope, build results, and verification evidence (logs, screenshots, preview URLs).
- Link related GitHub issues with `Closes #ID` when applicable, and request review before merging.

## Security & Configuration Tips
- Store Cloudflare credentials as GitHub repository secrets (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_PROJECT_NAME`).
- After deployments, monitor preview links for regressions before approving merges.
