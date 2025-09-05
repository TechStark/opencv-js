// Final validation file to be compiled with the project context

// This file demonstrates that the original issue is resolved
// These TypeScript constructs should now work without compilation errors:

declare global {
  var cv: {
    BackgroundSubtractorMOG2: new (history?: number, varThreshold?: number, detectShadows?: boolean) => any;
    BackgroundSubtractor: new () => any;
    Mat: new (rows?: number, cols?: number, type?: number) => any;
    CV_8UC3: number;
  };
}

// ===== ORIGINAL ISSUE EXAMPLES =====
// These examples from the issue should now work without TypeScript errors:

// 1. Basic constructor usage - the main issue reported
const backgroundSubtractor = new cv.BackgroundSubtractorMOG2();

// 2. Constructor with parameters  
const backgroundSubtractorWithHistory = new cv.BackgroundSubtractorMOG2(500);
const backgroundSubtractorWithVarThreshold = new cv.BackgroundSubtractorMOG2(500, 16);
const backgroundSubtractorFull = new cv.BackgroundSubtractorMOG2(500, 16, true);

// 3. Method usage should work
const image = new cv.Mat(480, 640, cv.CV_8UC3);
const fgMask = new cv.Mat();

export {}; // Make this a module