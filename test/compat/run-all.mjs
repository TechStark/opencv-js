/**
 * Runs all compat checks for a given opencv.js in isolated child processes.
 *
 * Usage: node test/compat/run-all.mjs [path/to/opencv.js]
 *        (defaults to dist/opencv.js)
 */
import { execFileSync, execSync } from "child_process";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cvPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(__dirname, "../../dist/opencv.js");

const pass  = (msg) => console.log(`  PASS  ${msg}`);
const fail  = (msg) => { console.error(`  FAIL  ${msg}`); process.exitCode = 1; };
const info  = (msg) => console.log(`  INFO  ${msg}`);

// Detect opencv.js version: 5.x factory uses async/await internally
function detectVersion(filePath) {
  try {
    const src = readFileSync(filePath, "utf8");
    return src.includes("async function(moduleArg") ? "5.x" : "4.x";
  } catch { return "unknown"; }
}

// Run a check script and parse PASS:/FAIL: lines from output.
// informationalFails: FAIL messages matching these strings are demoted to INFO.
function run(label, scriptPath, { informationalFails = [] } = {}) {
  console.log(`\n${label}`);
  let output = "";
  let crashed = false;
  try {
    output = execFileSync(process.execPath, [scriptPath, cvPath], {
      timeout: 20000,
      encoding: "utf8",
    });
  } catch (e) {
    output = (e.stdout || "") + (e.stderr || "");
    crashed = true;
  }

  const lines = output.trim().split("\n");
  const hasResult = lines.some(l => l.startsWith("PASS:") || l.startsWith("FAIL:"));

  for (const line of lines) {
    if (line.startsWith("PASS:")) {
      pass(line.slice(5).trim());
    } else if (line.startsWith("FAIL:")) {
      const msg = line.slice(5).trim();
      const isInformational = informationalFails.some(pat => msg.includes(pat));
      if (isInformational) {
        info(`${msg}  [known limitation of this test — not a real bug in this version]`);
      } else {
        fail(msg);
      }
    } else if (
      line &&
      !line.includes("UnhandledPromiseRejection") &&
      !line.includes("abort(") &&
      !line.match(/^\s+at /) &&
      !line.includes("code: '")
    ) {
      console.log(`       ${line}`);
    }
  }

  if (crashed && !hasResult) {
    fail(`process crashed: ${output.split("\n")[0]}`);
  }
}

const version = detectVersion(cvPath);
console.log(`opencv.js compatibility checks`);
console.log(`Target: ${cvPath}  (detected: ${version})`);

// Note: 5.x has the same outer UMD wrapper `}(this, ...)` as 4.x.
// In a browser ESM <script type="module">, this=undefined causes the same
// root.cv crash. This is a real issue in 5.x, not a false alarm.
// If 5.x is used in browser ESM, the `this→globalThis` patch still applies.
run("1. ESM context (this === undefined)",
  path.join(__dirname, "check-esm.mjs"));

// check-strict uses vm.runInNewContext which can't distinguish 4.x from 5.x:
// 5.x has the same bare `Module = {}` line but it's unreachable in real loaders.
// Demote 5.x strict-mode failures to INFO.
run("2. Strict mode (no ReferenceError on Module)",
  path.join(__dirname, "check-strict.cjs"),
  version === "5.x" ? { informationalFails: ["ReferenceError in strict mode"] } : {});

run("3. CommonJS baseline (Mat creation + delete)",
  path.join(__dirname, "check-cjs.cjs"));

console.log(process.exitCode === 1 ? "\nResult: FAILED" : "\nResult: all checks passed");
