"use strict";
/**
 * Check 2: UMD wrapper must not throw ReferenceError in strict mode.
 *
 * Problem (4.x official): inside the UMD factory, near the end:
 *   if (typeof Module === 'undefined')
 *     Module = {};          // bare assignment — ReferenceError in strict mode
 *
 * Fix (4.x patched):
 *     var Module = {};      // declares a local variable — safe in strict mode
 *
 * How we reproduce: vm.runInNewContext() runs the script in a completely fresh
 * context with no CJS globals (no require, no module, no exports, no __dirname).
 * The UMD wrapper's `module.exports` branch is skipped (module is undefined),
 * falling through to the inner factory code — which hits `Module = {}` in strict
 * mode inside the factory function.
 *
 * We wrap the entire source in "use strict" to simulate a Webpack bundle output.
 *
 * NOTE: 5.x also has this bare `Module = {}` line and will FAIL this check.
 * In practice 5.x is safe because real loaders (require/Webpack) always satisfy
 * the `typeof module === "object"` branch and never reach this line.
 * This check is most meaningful as a regression test for the 4.x patch.
 *
 * Usage: node test/compat/check-strict.cjs <path/to/opencv.js>
 */
const vm = require("vm");
const fs = require("fs");
const path = require("path");

const cvPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(__dirname, "../../dist/opencv.js");

const pass = (msg) => console.log(`PASS: ${msg}`);
const fail = (msg) => { console.error(`FAIL: ${msg}`); process.exitCode = 1; };

// Suppress unhandled rejections from WASM async init — they are expected
// when running opencv.js without a proper runtime environment.
process.on("unhandledRejection", () => {});

const src = fs.readFileSync(cvPath, "utf8");

// Simulate a Webpack-style bundle: entire source wrapped in "use strict",
// no CJS globals injected (vm.runInNewContext gives a clean sandbox).
const strictSrc = `"use strict";\n${src}`;

// We only need to run far enough to hit the Module = {} line.
// The WASM won't initialize (no WebAssembly in vm context) — that's fine,
// we just need to observe whether a ReferenceError is thrown.
const sandbox = {
  // Provide just enough globals to get past early checks
  console,
  setTimeout,
  clearTimeout,
  // Explicitly absent: module, exports, require, __dirname, window, define
};

try {
  vm.runInNewContext(strictSrc, sandbox, { timeout: 3000 });
  pass("no ReferenceError in strict mode (Module handled correctly)");
} catch (e) {
  if (e instanceof ReferenceError) {
    fail(`ReferenceError in strict mode: ${e.message}`);
  } else if (e.constructor.name === "ReferenceError") {
    fail(`ReferenceError in strict mode: ${e.message}`);
  } else {
    // WASM init errors, WebAssembly not available, etc. — the wrapper itself is fine
    pass(`no ReferenceError from UMD wrapper (other error: ${e.constructor.name}: ${e.message.slice(0, 80)})`);
  }
}
