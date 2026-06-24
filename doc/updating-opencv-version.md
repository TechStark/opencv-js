# How to Update the OpenCV Version

Follow these steps in order when bumping to a new OpenCV release.

---

## 0. Check whether the official binary is available

```bash
# Replace X.Y.Z with the target version
curl -I "https://docs.opencv.org/X.Y.Z/opencv.js"
```

- **200 OK** → official binary exists, proceed to step 1a.
- **404** → not published yet, use step 1b (CI build).

> **Known status:** As of 2026-06, `docs.opencv.org` publishes up to **4.13.0** (same file as `4.x`).  
> **5.0.0 is not yet published** — use the CI build workflow.

---

## 1a. Official binary (when available)

```bash
curl -L "https://docs.opencv.org/X.Y.Z/opencv.js" -o dist/opencv.js
```

---

## 1b. Build from source via GitHub Actions CI

Trigger the **Build OpenCV.js** workflow manually:

- **Actions → Build OpenCV.js → Run workflow**
- `opencv_version`: target version tag (e.g. `5.0.0`)
- `emscripten_version`: `4.0.20` (bump only if OpenCV release notes require it)
- `cmake_options`: `-DCMAKE_CXX_STANDARD=17` (required for Emscripten 4.0.20+, OpenCV 5.x)
- `build_flags`: leave empty (defaults: `SINGLE_FILE=1 USE_PTHREADS=0`)

Download the `opencv.js` artifact from the resulting GitHub Release and replace `dist/opencv.js`.

**Why C++17?** OpenCV 4.x was built with C++11. OpenCV 5.x mandates C++17, and Emscripten 4.0.20+ requires it for Embind. The old official 4.12.0 binary used Emscripten LLVM 10 / C++11 — do not copy those flags for 5.x.

---

## 2. Update version strings

Replace the old version (e.g. `4.12.0`) with the new one in these files:

| File | What to update |
|------|---------------|
| `package.json` | `"version"` — format `X.Y.Z-release.1` |
| `CLAUDE.md` | Version, OpenCV Version, build parameters section |
| `README.md` | `docs.opencv.org` URL (2 occurrences) |
| `.github/copilot-instructions.md` | Version field, OpenCV Version line, all `docs.opencv.org` URLs |
| `.github/workflows/build-opencv-js.yml` | Default fallback version (2 occurrences) |

Audit command — catch anything missed:

```bash
grep -r "OLD_VERSION" . --exclude-dir=node_modules -l
```

---

## 3. Run install, build, and tests

```bash
npm install          # regenerates package-lock.json
npm run build        # TypeScript compile
npm test             # all tests must pass
```

The `cvKeys.test.ts` test validates that the binary loads and its API surface is intact — a passing test suite is your confirmation that the new binary works.

---

## 4. Update doc/cvKeys.json

`doc/cvKeys.json` stores the build information and API key list from the binary. After tests pass, regenerate it:

```bash
node -e "
const cv = require('./dist/opencv.js');
cv.onRuntimeInitialized = () => {
  const keys = Object.keys(cv).sort();
  const data = { buildInformation: cv.getBuildInformation(), keys };
  require('fs').writeFileSync('doc/cvKeys.json', JSON.stringify(data, null, 2));
  console.log('cvKeys.json updated:', keys.length, 'keys');
};
"
```

---

## 5. Commit

```bash
git add dist/opencv.js doc/cvKeys.json package.json package-lock.json \
        CLAUDE.md README.md \
        .github/copilot-instructions.md \
        .github/workflows/build-opencv-js.yml

git commit -m "Update OpenCV to X.Y.Z"
```

Publishing to NPM is handled by the **Publish NPM Package** workflow when a GitHub Release is created, or trigger it manually via `workflow_dispatch`.
