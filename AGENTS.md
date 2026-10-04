# Repository instructions

## Product constraints

- Keep the app static: HTML, CSS and Vanilla JavaScript; no server, database, external AI requirement or build step.
- Preserve direct `index.html` execution and GitHub Pages relative paths.
- Keep credentials out of source files, browser storage, exports and tool output.

## Authorized publishing workflow

The user explicitly requested on 2026-10-04 that completed changes be committed and pushed to GitHub automatically, without another manual ZIP upload.

- Repository: `https://github.com/gmlduqzhd123-lab/Making-Film.git`.
- Publishing branch: `main`; the existing GitHub Pages site deploys from this branch.
- After finishing a requested change and the relevant checks, commit and publish the completed work to `origin/main` in the same task. Do not ask again for routine commit/push permission. A later user instruction to keep work local or defer publishing overrides this preference.
- Fetch the current remote state first, preserve other changes, and use fast-forward updates. Never force push or discard local work.
- Use the connected GitHub account matching repository owner `gmlduqzhd123-lab` for writes.
- If native Git cannot authenticate, use the authorized GitHub connector's blob/tree/commit/ref operations to publish the verified tree. Then fetch it and verify that the remote and local file trees match. Synchronize the local `main` tracking branch while preserving any unpublished branches.
- When a commit affects the web app, verify the Pages deployment and changed behavior on the published URL. Report any deployment limitation honestly.

## Checks

- Run `node tests/prd-parser.cjs` for PRD parsing changes.
- Use `tests/prd-e2e.cjs` for PRD input/generation/export changes and `tests/e2e.cjs` for the relevant existing app regressions. These developer checks require Playwright; app users do not need it.
- Check the browser console, relative assets and `git diff --check` before publishing code changes.
