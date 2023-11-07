import "../src";

export async function setupOpenCv() {
  return new Promise((resolve) => {
    const _cv = require("../dist/opencv");
    _cv.onRuntimeInitialized = resolve;
    global.cv = _cv;
  });
}

export function translateException(err: any) {
  if (typeof err === "number") {
    try {
      const exception = cv.exceptionFromPtr(err);
      return exception;
    } catch (error) {
      // ignore
    }
  }
  return err;
}
