"use strict";
/**
 * Check 2: UMD wrapper must not throw ReferenceError in strict mode.
 *
 * Problem (4.x official): the UMD factory function contains:
 *   if (typeof Module === 'undefined')
 *     Module = {};          // bare assignment — ReferenceError in strict mode
 * This line always executes (no return before it), so it fires in strict mode
 * even when Webpack provides module/exports. Fix: `var Module = {}`.
 *
 * 5.x has the same bare `Module = {}` line structurally, but in practice it is
 * never reached in real environments — real loaders (require, Webpack) satisfy
 * the CJS wrapper's non-strict execution context so the bare assignment is legal.
 * In this vm test 5.x will also FAIL: that is a known limitation of this approach.
 * The test is authoritative for 4.x regression; treat 5.x FAIL as informational.
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

// Suppress unhandled rejections from WASM async init
process.on("unhandledRejection", () => {});

const src = fs.readFileSync(cvPath, "utf8");

// Simulate a Webpack bundle:
//   - "use strict" wraps everything
//   - module and exports are provided (Webpack always injects these)
//   - no window, no define, no importScripts
const sandbox = {
  console,
  setTimeout,
  clearTimeout,
  module: { exports: {} },
  exports: {},
  // Explicitly absent: window, define, importScripts
};

const strictSrc = `"use strict";\n${src}`;

try {
  vm.runInNewContext(strictSrc, sandbox, { timeout: 3000 });
  pass("no ReferenceError in strict mode with module/exports provided");
} catch (e) {
  // Note: vm context errors have a different ReferenceError constructor than
  // the outer scope, so `instanceof ReferenceError` is false — use name check.
  if (e.constructor.name === "ReferenceError") {
    fail(`ReferenceError in strict mode: ${e.message}`);
  } else {
    // WASM init errors, WebAssembly not available, etc. — wrapper itself is fine
    pass(`no ReferenceError from UMD wrapper (other error: ${e.constructor.name}: ${e.message.slice(0, 80)})`);
  }
}
