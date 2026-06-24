# opencv-js — Claude Development Guide

## Project Overview

TypeScript NPM package wrapping the pre-built OpenCV.js (WASM) binary with type definitions. Supports Node.js and browser environments.

- **Package:** `@techstark/opencv-js`
- **Version:** `5.0.0-release.1`
- **OpenCV Version:** 5.0.0 (WASM binary in `dist/opencv.js`)
- **Binary source:** Built via GitHub Actions (`build-opencv-js.yml`) — official `docs.opencv.org` does not yet publish 5.x

## Essential Commands

```bash
npm install        # ~15s — regenerates package-lock.json
npm run build      # ~2s  — TypeScript compile (tsc)
npm test           # ~8s  — Jest test suite (38 tests)
npm run format     # ~1s  — Prettier
```

NEVER cancel builds or tests. Always run the full sequence after any change:
```bash
npm install && npm run build && npm test
```

## File Structure

```
dist/opencv.js          — pre-built WASM binary (~10MB), never edit
src/index.ts            — re-exports from types/
src/types/opencv/       — 100+ TypeScript definition files
test/                   — Jest tests (Mat, Tracker, rect, cvKeys, QRCode, etc.)
doc/cvKeys.json         — runtime API surface snapshot (buildInformation + keys)
.github/workflows/
  build-opencv-js.yml   — builds opencv.js from source via Emscripten
  npm-publish.yml       — publishes to NPM on release
  unit-test.yml         — CI tests on PR/push
```

## Memory Management (Critical)

Always call `.delete()` on OpenCV objects — WASM memory does not GC:

```typescript
const mat = new cv.Mat(3, 3, cv.CV_8UC1);
try {
  // use mat
} finally {
  mat.delete();
}
```

## Import Patterns

**Current API (v4.11+):**
```typescript
import cvReadyPromise from "@techstark/opencv-js";
const cv = await cvReadyPromise;
```

**Legacy API (v4.10-):**
```typescript
import cv from "@techstark/opencv-js";
cv.onRuntimeInitialized = () => { /* use cv */ };
```

## Browser webpack polyfills

```javascript
resolve: { fallback: { fs: false, path: false, crypto: false } }
```

## Updating the OpenCV Version

See `doc/updating-opencv-version.md` for the full checklist.

**Quick summary:**
1. Build new `dist/opencv.js` via GitHub Actions (`build-opencv-js.yml`)
2. Replace `dist/opencv.js` with the artifact
3. Update version strings: `package.json`, `README.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, `build-opencv-js.yml`
4. Run `npm install && npm run build && npm test`
5. Regenerate `doc/cvKeys.json` (run `npm test` — the cvKeys test validates the binary)

**Build parameters for 5.0.0:**
- Emscripten: `4.0.20`
- CMake option: `-DCMAKE_CXX_STANDARD=17` (required for Emscripten 4.0.20+)
- Build flags: default (no custom flags needed)

## Common Issues

| Error | Cause | Fix |
|-------|-------|-----|
| `cv.Mat is not a constructor` | OpenCV not initialized | use `await cvReadyPromise` |
| Memory leak / browser crash | Missing `.delete()` | add `.delete()` in finally |
| webpack `fs` not found | Missing polyfills | add fallback config |
| Test failures on `setupOpenCv()` | Async init not awaited | check test helper |

## Security

- `dist/opencv.js` comes from our own CI build (OpenCV source + Emscripten) — verify origin before accepting external files
- Run `npm audit fix` before committing
