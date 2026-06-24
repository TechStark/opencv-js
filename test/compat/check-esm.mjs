/**
 * Check 1: require() from ESM createRequire must succeed (no crash on this=undefined).
 *
 * In ESM, top-level `this` is undefined. If the UMD wrapper's `root.cv = factory()`
 * runs unconditionally (instead of only in the else branch), it crashes with
 * TypeError: Cannot set properties of undefined.
 *
 * We verify:
 *   a) We are actually in ESM (this === undefined)
 *   b) require() from createRequire succeeds and returns an object
 *
 * Note: full WASM initialization is tested in check-cjs.cjs.
 * In Node.js v24, some opencv.js versions keep the event loop alive after init,
 * so we only verify the module loads without crashing.
 *
 * Usage: node test/compat/check-esm.mjs <path/to/opencv.js>
 */
import { fileURLToPath } from "url";
import { createRequire } from "module";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cvPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(__dirname, "../../dist/opencv.js");

const pass = (msg) => console.log(`PASS: ${msg}`);
const fail = (msg) => { console.error(`FAIL: ${msg}`); process.exitCode = 1; };

// a) Confirm ESM context
if (typeof this === "undefined") {
  pass("this is undefined (confirmed ESM context)");
} else {
  fail(`this is not undefined: ${typeof this}`);
}

// b) require() must not throw
const require = createRequire(import.meta.url);
try {
  const m = require(cvPath);
  if (m && typeof m === "object") {
    pass("require() from ESM succeeded (no TypeError on root.cv)");
  } else {
    fail(`require() returned unexpected value: ${typeof m}`);
  }
} catch (e) {
  if (e instanceof TypeError && e.message.includes("Cannot set")) {
    fail(`UMD wrapper crashed: root is undefined in ESM (${e.message})`);
  } else {
    fail(`require() threw: ${e.constructor.name}: ${e.message}`);
  }
}
