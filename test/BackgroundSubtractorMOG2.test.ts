import { setupOpenCv } from "./cv";

beforeAll(async () => {
  await setupOpenCv();
});

describe("BackgroundSubtractorMOG2", () => {
  it("should have correct TypeScript definitions for constructor", () => {
    // Test constructor without parameters
    const bs1 = new cv.BackgroundSubtractorMOG2();
    expect(bs1).toBeDefined();
    bs1.delete();

    // Test constructor with history parameter
    const bs2 = new cv.BackgroundSubtractorMOG2(500);
    expect(bs2).toBeDefined();
    bs2.delete();

    // Test constructor with history and varThreshold
    const bs3 = new cv.BackgroundSubtractorMOG2(500, 16);
    expect(bs3).toBeDefined();
    bs3.delete();

    // Test constructor with all parameters
    const bs4 = new cv.BackgroundSubtractorMOG2(500, 16, true);
    expect(bs4).toBeDefined();
    bs4.delete();
  });

  it("should have correct TypeScript definitions for inherited methods", () => {
    const bs = new cv.BackgroundSubtractorMOG2();
    
    // Test inherited methods from BackgroundSubtractor
    expect(typeof bs.apply).toBe("function");
    expect(typeof bs.getBackgroundImage).toBe("function");
    
    // Test apply method with a real Mat
    const testImage = new cv.Mat(100, 100, cv.CV_8UC3);
    const fgMask = new cv.Mat();
    
    // This should not throw TypeScript errors
    bs.apply(testImage, fgMask);
    bs.apply(testImage, fgMask, 0.1); // with learning rate
    
    // Test getBackgroundImage method
    const bgImage = new cv.Mat();
    bs.getBackgroundImage(bgImage);
    
    // Clean up
    testImage.delete();
    fgMask.delete();
    bgImage.delete();
    bs.delete();
  });

  it("should work in TypeScript usage scenarios from the issue", () => {
    // This test verifies the original issue is resolved
    // These should compile without TypeScript errors
    
    // Test the main usage pattern mentioned in the issue
    const backgroundSubtractor = new cv.BackgroundSubtractorMOG2();
    expect(backgroundSubtractor).toBeDefined();
    
    // Test with parameters
    const backgroundSubtractorWithParams = new cv.BackgroundSubtractorMOG2(500, 16, true);
    expect(backgroundSubtractorWithParams).toBeDefined();
    
    // Clean up
    backgroundSubtractor.delete();
    backgroundSubtractorWithParams.delete();
  });
});