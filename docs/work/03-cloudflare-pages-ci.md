# Task 03 – Automate deploys to Cloudflare Pages

## Objective
Enable continuous delivery so each PR surfaces a preview URL and merges to `main` promote the site to production on Cloudflare Pages.

## Scope
- Create `wrangler.toml` configured for Pages Direct Upload with placeholders for secrets.
- Add `.github/workflows/deploy.yml` that installs Node 20, runs `npm ci`, builds, and deploys via `cloudflare/pages-action@v1` for both preview (PR) and production (`main`).
- Document required GitHub Secrets (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_PROJECT_NAME`).
- Verify the workflow by running it end-to-end.

## Exclusions
- Domains/SSL configuration (handled after MVP once the Pages project exists).
- Non-GitHub CI providers or manual upload paths.

## Steps
1. Ensure the scaffold from Tasks 01–02 is merged or rebased into your working branch.
2. Create `wrangler.toml` per the plan, referencing environment variables for sensitive values.
3. Add the GitHub Actions workflow file with separate preview/production steps.
4. In GitHub, create the required secrets with credentials from Cloudflare (one-time manual step).
5. Push the branch and open a PR to trigger the workflow; confirm the action reaches the deploy step.
6. Merge to `main` (or temporarily retarget the workflow) to validate the production deployment path.
7. Update project docs/README with a short "Deployment" section referencing the workflow and secrets.
8. Commit changes with message `ci: add Cloudflare Pages pipeline`.

## Definition of Done
- Workflow run on the PR completes successfully and surfaces a Cloudflare Pages preview URL in the Actions summary.
- A production deployment is created when the workflow runs on `main` (visible in Cloudflare Pages dashboard).
- `wrangler.toml` is present with no hard-coded secrets.
- Deployment documentation exists for future contributors.

## Verification checklist
- Attach a screenshot or link to the successful GitHub Actions run with the preview URL in the PR thread.
- Confirm in Cloudflare Pages UI that the project shows both preview and production deployments tied to the repo.
