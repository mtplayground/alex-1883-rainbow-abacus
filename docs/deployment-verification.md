# Deployment Verification

Issue #23 prepares the static production build for self-hosted deployment.

## Build Output

- Production output is generated in `dist/` by `npm run build`.
- `dist/` is intentionally ignored by git because Vite emits hashed filenames.
- The Vite config uses `base: "./"` so the build can be served from a plain static directory without assuming a domain root.

## Verification Command

Run:

```sh
npm run verify:static
```

The command rebuilds the app, starts a local static file server rooted at `dist/`, fetches `/`, fetches every emitted file under `dist/assets/`, and confirms the expected bundled audio assets are present:

- `bead-click-*.wav`
- `reach-ten-celebration-*.wav`
- `toy-shelf-ambience-*.wav`

The current application does not emit image assets; the verifier reports that explicitly so a future image asset will be included in the same served-file check.

## Manual Deployment Shape

Serve the contents of `dist/` from any static host. The server only needs to return `index.html` and the emitted files under `assets/`; no backend, database, or runtime environment variables are required for this abacus activity.
