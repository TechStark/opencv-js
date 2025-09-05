import { setupOpenCv } from "./cv";

beforeAll(setupOpenCv);

describe("ximgproc module", () => {
  it("should have ximgproc module available", () => {
    expect(cv.ximgproc).toBeDefined();
  });

  it("should have thinning function available", () => {
    expect(cv.ximgproc.thinning).toBeDefined();
    expect(typeof cv.ximgproc.thinning).toBe("function");
  });

  it("should have thinning types available", () => {
    expect(cv.ximgproc.THINNING_ZHANGSUEN).toBeDefined();
    expect(cv.ximgproc.THINNING_GUOHALL).toBeDefined();
  });

  it("should be able to perform thinning operation", () => {
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