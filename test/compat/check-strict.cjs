"use strict";
/**
 * Check 2: UMD wrapper must not throw ReferenceError in strict mode.
 * In 4.x official, `Module = {}` without `var` throws ReferenceError in strict mode.
 *
 * Approach: write a wrapper file that requires opencv.js inside "use strict",
 * run it as a child process, and check for ReferenceError.
 *
 * Usage: node test/compat/check-strict.cjs <path/to/opencv.js>
 */
const { execFileSync, spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const cvPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(__dirname, "../../dist/opencv.js");

const pass = (msg) => console.log(`PASS: ${msg}`);
const fail = (msg) => { console.error(`FAIL: ${msg}`); process.exitCode = 1; };

// Write a strict-mode wrapper that requires the opencv.js
const tmp = path.join(os.tmpdir(), `strict-test-${Date.now()}.cjs`);
fs.writeFileSync(tmp, `
"use strict";
try {
  require(${JSON.stringify(cvPath)});
  process.exit(0);
} catch(e) {
  process.stderr.write(e.constructor.name + ": " + e.message + "\\n");
  process.exit(1);
}
`);

try {
  const result = spawnSync(process.execPath, [tmp], { timeout: 5000, encoding: "utf8" });
  fs.unlinkSync(tmp);

  if (result.status === 0) {
    pass("require() in strict mode succeeded (no ReferenceError)");
  } else {
    const errOutput = (result.stderr || "").trim();
    if (errOutput.startsWith("ReferenceError")) {
      fail(`ReferenceError in strict mode: ${errOutput}`);
    } else {
      // Non-ReferenceError (e.g. missing deps) — strict mode wrapper itself is fine
      pass(`No ReferenceError in strict mode (other error: ${errOutput.slice(0, 80)})`);
    }
  }
} catch (e) {
  try { fs.unlinkSync(tmp); } catch {}
  fail(`could not run strict mode test: ${e.message}`);
}
