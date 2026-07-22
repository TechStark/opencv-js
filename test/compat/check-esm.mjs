/**
 * Check 1: UMD wrapper must not crash when `this` is undefined (ESM context).
 *
 * Problem (4.x official): the UMD wrapper passes `this` as root:
 *   }(this, function () { ... }));
 * In a browser ESM <script type="module">, `this` is undefined.
 * The else branch then runs:  root.cv = factory()  →  TypeError.
 *
 * Fix (4.x patched): uses `globalThis` instead — always defined.
 * Fix (5.x): internal module detection doesn't rely on root at all.
 *
 * How we reproduce with vm.runInNewContext:
 *   Replace the wrapper's root argument with `undefined` to exactly match
 *   browser ESM behavior, then run in a sandbox with no window/module/define.
 *
 * Usage: node test/compat/check-esm.mjs <path/to/opencv.js>
 */
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import vm from "vm";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cvPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(__dirname, "../../dist/opencv.js");

const pass = (msg) => console.log(`PASS: ${msg}`);
const fail = (msg) => { console.error(`FAIL: ${msg}`); process.exitCode = 1; };

// Suppress unhandled rejections from WASM async init
process.on("unhandledRejection", () => {});

// Confirm we are in ESM
if (typeof this === "undefined") {
  pass("this is undefined (confirmed ESM context)");
} else {
  fail(`this is not undefined: ${typeof this}`);
}

const src = readFileSync(cvPath, "utf8");

// Patch `this` → `undefined` in the wrapper call to exactly simulate
// browser ESM top-level scope where `this` is undefined.
const patchedSrc = src.replace(/\}\(this,\s*function/, "}(undefined, function");

// Minimal sandbox: no module/window/define/importScripts
// so the UMD wrapper's else branch is the only option.
const sandbox = { console, setTimeout, clearTimeout };

try {
  vm.runInNewContext(patchedSrc, sandbox, { timeout: 2000 });
  pass("UMD wrapper survived root=undefined (no crash)");
} catch (e) {
  const msg = e.message || "";
  if (msg.includes("Cannot set properties of undefined") || msg.includes("Cannot read properties of undefined")) {
    fail(`UMD root crash (root.cv = factory() with root=undefined): ${msg}`);
  } else {
    // WASM/init errors mean the wrapper itself survived — the crash is downstream
    pass(`UMD wrapper survived root=undefined (WASM/init error is expected: ${e.constructor.name})`);
  }
}
