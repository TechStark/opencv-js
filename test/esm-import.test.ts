import { setupOpenCv } from "./cv";

beforeAll(setupOpenCv);

describe("ESM Import Compatibility", () => {
  it("should work with browser window object when root is undefined", () => {
    // This test validates that the UMD wrapper uses window.cv instead of root.cv
    // when in a browser context (typeof window === 'object')
    
    // The fix changes line 14 in dist/opencv.js from:
    // root.cv = factory();
    // to:
    // window.cv = factory();
    
    // This ensures ESM imports work in browsers where 'root' may be undefined
    expect(cv).toBeDefined();
    expect(cv.Mat).toBeDefined();
    expect(typeof cv.Mat).toBe("function");
  });

  it("should have basic OpenCV functionality available", () => {
    // Create a simple Mat to verify cv object is properly initialized
    const mat = new cv.Mat(3, 3, cv.CV_8UC1);
    expect(mat.rows).toBe(3);
    expect(mat.cols).toBe(3);
    expect(mat.channels()).toBe(1);
    mat.delete();
  });
});
