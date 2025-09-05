import { setupOpenCv } from "./cv";

beforeAll(async () => {
  await setupOpenCv();
});

describe("QRCodeDetector", () => {
  it("should be available as a class", () => {
    expect(cv.QRCodeDetector).toBeDefined();
    expect(typeof cv.QRCodeDetector).toBe("function");
  });

  it("should be able to create QRCodeDetector instance", () => {
    const detector = new cv.QRCodeDetector();
    expect(detector).toBeDefined();
    expect(detector.constructor.name).toBe("QRCodeDetector");
  });

  it("should have detect method", () => {
    const detector = new cv.QRCodeDetector();
    expect(detector.detect).toBeDefined();
    expect(typeof detector.detect).toBe("function");
  });

  it("should have decode method", () => {
    const detector = new cv.QRCodeDetector();
    expect(detector.decode).toBeDefined();
    expect(typeof detector.decode).toBe("function");
  });

  it("should have detectAndDecode method", () => {
    const detector = new cv.QRCodeDetector();
    expect(detector.detectAndDecode).toBeDefined();
    expect(typeof detector.detectAndDecode).toBe("function");
  });

  it("should have detectMulti method", () => {
    const detector = new cv.QRCodeDetector();
    expect(detector.detectMulti).toBeDefined();
    expect(typeof detector.detectMulti).toBe("function");
  });

  it("should have decodeMulti method", () => {
    const detector = new cv.QRCodeDetector();
    expect(detector.decodeMulti).toBeDefined();
    expect(typeof detector.decodeMulti).toBe("function");
  });

  it("should have detectAndDecodeMulti method", () => {
    const detector = new cv.QRCodeDetector();
    expect(detector.detectAndDecodeMulti).toBeDefined();
    expect(typeof detector.detectAndDecodeMulti).toBe("function");
  });

  it("should be able to clean up detector", () => {
    const detector = new cv.QRCodeDetector();
    // Just verify we can call delete without errors
    expect(() => detector.delete()).not.toThrow();
  });
});

describe("QRCodeDetectorAruco", () => {
  it("should be available as a class", () => {
    expect(cv.QRCodeDetectorAruco).toBeDefined();
    expect(typeof cv.QRCodeDetectorAruco).toBe("function");
  });

  it("should be able to create QRCodeDetectorAruco instance", () => {
    const detector = new cv.QRCodeDetectorAruco();
    expect(detector).toBeDefined();
    expect(detector.constructor.name).toBe("QRCodeDetectorAruco");
  });

  it("should have detect method", () => {
    const detector = new cv.QRCodeDetectorAruco();
    expect(detector.detect).toBeDefined();
    expect(typeof detector.detect).toBe("function");
  });

  it("should have decode method", () => {
    const detector = new cv.QRCodeDetectorAruco();
    expect(detector.decode).toBeDefined();
    expect(typeof detector.decode).toBe("function");
  });

  it("should have detectAndDecode method", () => {
    const detector = new cv.QRCodeDetectorAruco();
    expect(detector.detectAndDecode).toBeDefined();
    expect(typeof detector.detectAndDecode).toBe("function");
  });

  it("should be able to clean up detector", () => {
    const detector = new cv.QRCodeDetectorAruco();
    // Just verify we can call delete without errors
    expect(() => detector.delete()).not.toThrow();
  });
});

describe("QRCodeDetectorAruco_Params", () => {
  it("should be available as a class", () => {
    expect(cv.QRCodeDetectorAruco_Params).toBeDefined();
    expect(typeof cv.QRCodeDetectorAruco_Params).toBe("function");
  });

  it("should be able to create QRCodeDetectorAruco_Params instance", () => {
    const params = new cv.QRCodeDetectorAruco_Params();
    expect(params).toBeDefined();
    expect(params.constructor.name).toBe("QRCodeDetectorAruco_Params");
  });

  it("should have expected properties", () => {
    const params = new cv.QRCodeDetectorAruco_Params();
    expect(params.minModuleSizeInPyramid).toBeDefined();
    expect(params.maxRotation).toBeDefined();
    expect(params.maxModuleSizeMismatch).toBeDefined();
    expect(params.maxTimingPatternMismatch).toBeDefined();
    expect(params.maxPenalties).toBeDefined();
    expect(params.maxColorsMismatch).toBeDefined();
    expect(params.scaleTimingPatternScore).toBeDefined();
  });
});