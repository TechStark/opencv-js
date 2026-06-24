# How to Update the OpenCV Version

Follow these steps in order when bumping to a new OpenCV release.

---

## 0. Check whether the official binary is available

```bash
curl -I "https://docs.opencv.org/X.Y.Z/opencv.js"
```

- **200 OK** → download directly (step 1a)
- **404** → build from source via CI (step 1b)

> **Known status (2026-06):** `docs.opencv.org` publishes up to **4.13.0**. **5.0.0 is not yet published** — use step 1b.

---

## 1a. Official binary (when available)

```bash
curl -L "https://docs.opencv.org/X.Y.Z/opencv.js" -o dist/opencv.js
```

---

## 1b. Build from source via GitHub Actions CI

- **Actions → Build OpenCV.js → Run workflow**
- `opencv_version`: target version tag (e.g. `5.0.0`)
- `emscripten_version`: `4.0.20` (bump only if OpenCV release notes require it)
- `cmake_options`: `-DCMAKE_CXX_STANDARD=17` (required for Emscripten 4.0.20+)
- `build_flags`: leave empty

Download the `opencv.js` artifact from the resulting GitHub Release, replace `dist/opencv.js`.

> **Why C++17?** OpenCV 5.x mandates C++17. Emscripten 4.0.20+ also requires it for Embind.

---

## 2. Apply UMD compatibility patches

The downloaded binary needs two patches regardless of version. See `dist/opencv.js.patch` for the exact changes and rationale.

```bash
# Patch 1: this → globalThis (fixes browser ESM TypeError)
sed -i '' 's/}(this, function () {/}(globalThis, function () {/' dist/opencv.js

# Patch 2: Module = {} → var Module = {} (fixes Webpack strict mode ReferenceError)
sed -i '' 's/    Module = {};/    var Module = {};/' dist/opencv.js
```

Verify both patches applied:

```bash
grep -c "globalThis, function" dist/opencv.js   # expect 1
grep -c "var Module = {}"      dist/opencv.js   # expect 1
```

---

## 3. Update version strings

Replace the old version (e.g. `4.12.0`) with the new one:

| File | What to update |
|------|----------------|
| `package.json` | `"version"` — format `X.Y.Z-release.1` |
| `CLAUDE.md` | Version, OpenCV Version, build parameters section |
| `README.md` | `docs.opencv.org` URL (2 occurrences) |
| `.github/copilot-instructions.md` | Version field, OpenCV Version line, all `docs.opencv.org` URLs |
| `.github/workflows/build-opencv-js.yml` | Default fallback version (2 occurrences) |

Audit command:

```bash
grep -r "OLD_VERSION" . --exclude-dir=node_modules -l
```

---

## 4. Install, build, and test

```bash
npm install          # regenerates package-lock.json
npm run build        # TypeScript compile
npm test             # 38+ tests must pass; also regenerates doc/cvKeys.json
npm run test:compat  # ESM / strict mode / CJS compat checks
```

`npm test` runs `cvKeys.test.ts` which rewrites `doc/cvKeys.json` from the live binary — no separate step needed.

`npm run test:compat` catches UMD wrapper regressions. To compare against the unpatched binary run:
```bash
node test/compat/run-all.mjs /path/to/unpatched-opencv.js
```

---

## 5. Commit

```bash
git add dist/opencv.js dist/opencv.js.patch \
        doc/cvKeys.json \
        package.json package-lock.json \
        CLAUDE.md README.md \
        .github/copilot-instructions.md \
        .github/workflows/build-opencv-js.yml

git commit -m "Update OpenCV to X.Y.Z"
```

Publishing to NPM is handled by the **Publish NPM Package** workflow when a GitHub Release is created, or trigger it manually via `workflow_dispatch`.
