import "../src/index.d.ts";

export async function setupOpenCv() {
  const cvModule = require("../dist/opencv.js");

  // Support both Promise and onRuntimeInitialized callback APIs
  let cv;
  if (cvModule instanceof Promise) {
    // Promise API
    cv = await cvModule;
  } else {
    // Callback API
    await new Promise<void>((resolve) => {
      cvModule.onRuntimeInitialized = () => {
        resolve();
      };
    });
    cv = cvModule;
  }
  global.cv = cv;
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
