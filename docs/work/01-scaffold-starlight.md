# Task 01 – Scaffold the Starlight baseline

## Objective
Spin up a clean Astro + Starlight project pinned to Node 20 so we have a reproducible starting point that already compiles locally.

## Scope
- Initialize the project with `npm create astro@latest -- --template starlight` in a fresh directory.
- Commit the generated sources together with `.nvmrc` and `.editorconfig` from the appendix.
- Verify the scaffold builds with npm (no PNPM/yarn switches in this task).

## Exclusions
- No content authoring beyond what the template generates.
- No CI/CD or Cloudflare configuration.

## Steps
1. Ensure Node 20.x is active (`node -v`). Install/activate via nvm if needed.
2. Run the Astro scaffold command, accept defaults that keep the project minimal.
3. Install dependencies with `npm install`.
4. Add `.nvmrc` (value `20`) and `.editorconfig` using the appendix snippets.
5. Run `npm run build` and confirm it succeeds.
6. Initialize git (if not already) and commit with message `feat: scaffold Astro Starlight`.

## Definition of Done
- Repository contains the generated Starlight structure plus `.nvmrc` and `.editorconfig`.
- `npm run build` completes without warnings or errors.
- Changes are committed on a clean branch ready for review.

## Verification checklist
- Paste the final `npm run build` output showing success into the PR description or deployment notes.
- `git status` reports a clean working tree.
