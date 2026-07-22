/**
 * Check 3: CommonJS baseline — Mat creation and memory cleanup.
 *
 * Usage: node test/compat/check-cjs.cjs <path/to/opencv.js>
 */
const path = require("path");

const cvPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(__dirname, "../../dist/opencv.js");

const pass = (msg) => console.log(`PASS: ${msg}`);
const fail = (msg) => { console.error(`FAIL: ${msg}`); process.exitCode = 1; };

const cvModule = require(cvPath);

function load(cb) {
  if (cvModule instanceof Promise) {
    cvModule.then(cb);
  } else if (cvModule.Mat) {
    cb(cvModule);
  } else {
    cvModule.onRuntimeInitialized = () => cb(cvModule);
    if (cvModule.Mat) cb(cvModule);
  }
}

load((cv) => {
  try {
    const mat = new cv.Mat(2, 2, cv.CV_8UC1);
    if (mat.rows === 2 && mat.cols === 2) {
      pass("Mat creation works");
    } else {
      fail(`Mat dimensions wrong: ${mat.rows}x${mat.cols}`);
    }
    mat.delete();
    pass("mat.delete() succeeded (no memory leak)");
  } catch (e) {
    fail(`Mat test failed: ${e.message}`);
  }
});
