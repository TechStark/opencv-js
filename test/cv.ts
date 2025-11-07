import "../src";

export async function setupOpenCv() {
  const _cv = require("../dist/opencv.js");
  
  // Support both Promise and onRuntimeInitialized callback APIs
  if (_cv instanceof Promise) {
    // Promise API
    const cv = await _cv;
    global.cv = cv;
  } else {
    // Callback API
    await new Promise<void>((resolve) => {
      _cv.onRuntimeInitialized = () => {
        global.cv = _cv;
        resolve();
      };
    });
  }
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
