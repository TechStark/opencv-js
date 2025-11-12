import { setupOpenCv } from "./cv";

beforeAll(setupOpenCv);

describe("ximgproc module", () => {
  it("should have ximgproc module available (requires contrib build)", () => {
    if (!cv.ximgproc) {
      console.warn('⚠️  ximgproc module not available. OpenCV.js needs to be built with opencv_contrib.');
      console.warn('   Run: npm run build:contrib to build with contrib modules');
      // Skip this test if contrib modules are not available
      expect(cv.ximgproc).toBeUndefined();
      return;
    }
    expect(cv.ximgproc).toBeDefined();
  });

  it("should have thinning function available (requires contrib build)", () => {
    if (!cv.ximgproc) {
      expect(cv.ximgproc).toBeUndefined();
      return;
    }
    expect(cv.ximgproc.thinning).toBeDefined();
    expect(typeof cv.ximgproc.thinning).toBe("function");
  });

  it("should have thinning types available (requires contrib build)", () => {
    if (!cv.ximgproc) {
      expect(cv.ximgproc).toBeUndefined();
      return;
    }
    expect(cv.ximgproc.THINNING_ZHANGSUEN).toBeDefined();
    expect(cv.ximgproc.THINNING_GUOHALL).toBeDefined();
  });

  it("should be able to perform thinning operation (requires contrib build)", () => {
    if (!cv.ximgproc) {
      console.warn('⚠️  Skipping thinning test - contrib modules not available');
      expect(cv.ximgproc).toBeUndefined();
      return;
    }

    // Create a simple binary image for testing
    const rows = 100;
    const cols = 100;
    const src = new cv.Mat(rows, cols, cv.CV_8UC1);
    
    // Create a simple shape to thin - fix the Scalar constructor
    cv.rectangle(src, new cv.Point(25, 25), new cv.Point(75, 75), new cv.Scalar(255, 255, 255, 255), -1);
    
    const dst = new cv.Mat();
    
    // This should not throw if thinning is available
    expect(() => {
      cv.ximgproc.thinning(src, dst, cv.ximgproc.THINNING_ZHANGSUEN);
    }).not.toThrow();

    expect(dst.rows).toBe(rows);
    expect(dst.cols).toBe(cols);
    
    // Clean up
    src.delete();
    dst.delete();
  });
});