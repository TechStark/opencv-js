/**
 * Runs all compat checks for a given opencv.js in isolated child processes.
 *
 * Usage: node test/compat/run-all.mjs [path/to/opencv.js]
 *        (defaults to dist/opencv.js)
 */
import { execFileSync } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cvPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(__dirname, "../../dist/opencv.js");

const pass = (msg) => console.log(`  PASS  ${msg}`);
const fail = (msg) => { console.error(`  FAIL  ${msg}`); process.exitCode = 1; };

function run(label, scriptPath) {
  console.log(`\n${label}`);
  try {
    const out = execFileSync(process.execPath, [scriptPath, cvPath], {
      timeout: 20000,
      encoding: "utf8",
    });
    out.trim().split("\n").forEach(line => {
      if (line.startsWith("PASS:")) pass(line.slice(5).trim());
      else if (line.startsWith("FAIL:")) fail(line.slice(5).trim());
      else if (line) console.log(`       ${line}`);
    });
  } catch (e) {
    const output = ((e.stdout || "") + (e.stderr || "")).trim();
    const lines = output.split("\n");
    const hasResult = lines.some(l => l.startsWith("PASS:") || l.startsWith("FAIL:"));
    lines.forEach(line => {
      if (line.startsWith("PASS:")) pass(line.slice(5).trim());
      else if (line.startsWith("FAIL:")) fail(line.slice(5).trim());
      // suppress WASM runtime noise (unhandled rejections, abort messages)
      else if (line && !line.includes("UnhandledPromiseRejection") && !line.includes("abort(") && !line.includes("at ") && !line.includes("code: '")) {
        console.log(`       ${line}`);
      }
    });
    if (!hasResult) fail(`process crashed: ${e.message.split("\n")[0]}`);
  }
}

console.log(`opencv.js compatibility checks`);
console.log(`Target: ${cvPath}`);

run("1. ESM context (this === undefined)", path.join(__dirname, "check-esm.mjs"));
run("2. Strict mode (no ReferenceError on Module)", path.join(__dirname, "check-strict.cjs"));
run("3. CommonJS baseline (Mat creation + delete)", path.join(__dirname, "check-cjs.cjs"));

console.log(process.exitCode === 1 ? "\nResult: FAILED" : "\nResult: all checks passed");
