import { setupOpenCv } from "./cv";

beforeAll(setupOpenCv);

describe("QRCodeEncoder", () => {
  it("should have correction level constants", () => {
    expect(typeof cv.QRCodeEncoder_CORRECT_LEVEL_Q).toBe('number');
    expect(typeof cv.QRCodeEncoder_CORRECT_LEVEL_H).toBe('number');
    expect(typeof cv.QRCodeEncoder_CORRECT_LEVEL_L).toBe('number');
    expect(typeof cv.QRCodeEncoder_CORRECT_LEVEL_M).toBe('number');
    
    // Verify the values are different
    expect(cv.QRCodeEncoder_CORRECT_LEVEL_L).not.toBe(cv.QRCodeEncoder_CORRECT_LEVEL_M);
    expect(cv.QRCodeEncoder_CORRECT_LEVEL_M).not.toBe(cv.QRCodeEncoder_CORRECT_LEVEL_Q);
    expect(cv.QRCodeEncoder_CORRECT_LEVEL_Q).not.toBe(cv.QRCodeEncoder_CORRECT_LEVEL_H);
  });

  it("should have encode mode constants", () => {
    expect(typeof cv.QRCodeEncoder_MODE_AUTO).toBe('number');
    expect(typeof cv.QRCodeEncoder_MODE_NUMERIC).toBe('number');
    expect(typeof cv.QRCodeEncoder_MODE_ALPHANUMERIC).toBe('number');
    expect(typeof cv.QRCodeEncoder_MODE_BYTE).toBe('number');
    expect(typeof cv.QRCodeEncoder_MODE_KANJI).toBe('number');
    expect(typeof cv.QRCodeEncoder_MODE_ECI).toBe('number');
    expect(typeof cv.QRCodeEncoder_MODE_STRUCTURED_APPEND).toBe('number');
  });

  it("should have ECI encoding constants", () => {
    expect(typeof cv.QRCodeEncoder_ECI_UTF8).toBe('number');
  });

  it("should have enum classes available", () => {
    expect(typeof cv.QRCodeEncoder_CorrectionLevel).toBe('function');
    expect(typeof cv.QRCodeEncoder_EncodeMode).toBe('function');
    expect(typeof cv.QRCodeEncoder_ECIEncodings).toBe('function');
    
    // Note: These are enum-like functions, not traditional constructors
    // They exist but may not be instantiable in the expected way
  });

  // Note: QRCodeEncoder class itself is not available in the current OpenCV.js build
  it("should document that QRCodeEncoder class is not available", () => {
    // This test documents the current limitation
    expect(typeof cv.QRCodeEncoder).toBe('undefined');
    
    // The constants exist but the class doesn't
    expect(typeof cv.QRCodeEncoder_CORRECT_LEVEL_Q).toBe('number');
  });

  it("should still have QRCodeDetector available for comparison", () => {
    // QRCodeDetector should be available
    expect(typeof cv.QRCodeDetector).toBe('function');
    expect(() => new cv.QRCodeDetector()).not.toThrow();
  });
});