# alex-1883-rainbow-abacus

Managed Creator playground.

## Static build

Run `npm run build` to produce a self-hosted static build in `dist/`. The Vite
config uses relative asset URLs, so the generated `index.html`, CSS, JS, and
bundled assets can be served from a plain static directory without a backend.

Asset source folders:

- `src/assets/audio/` for imported audio files that should be fingerprinted into
  the production bundle.
- `src/assets/images/` for imported image and texture files that should be
  fingerprinted into the production bundle.
- `public/` only for files that must be copied unchanged.
