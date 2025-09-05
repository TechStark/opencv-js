import { setupOpenCv } from "./cv";

beforeAll(setupOpenCv);

describe("QRCodeDetector Integration", () => {
  it("should be able to create QRCodeDetector instance", () => {
    expect(() => {
      const detector = new cv.QRCodeDetector();
      detector.delete();
    }).not.toThrow();
  });

  it("should have proper methods on QRCodeDetector", () => {
    const detector = new cv.QRCodeDetector();
    
    expect(typeof detector.detect).toBe('function');
    expect(typeof detector.decode).toBe('function');
    expect(typeof detector.detectAndDecode).toBe('function');
    
    detector.delete();
  });

  it("should be able to create QRCodeDetectorAruco instance", () => {
    expect(() => {
      const detector = new cv.QRCodeDetectorAruco();
      detector.delete();
    }).not.toThrow();
  });

  it("should be able to create QRCodeDetectorAruco with params", () => {
    expect(() => {
      const params = new cv.QRCodeDetectorAruco_Params();
      const detector = new cv.QRCodeDetectorAruco(params);
      
      params.delete();
      detector.delete();
    }).not.toThrow();
  });

  it("should handle empty image gracefully", () => {
    const detector = new cv.QRCodeDetector();
    const emptyImage = new cv.Mat(100, 100, cv.CV_8UC3, new cv.Scalar(255, 255, 255));
    
    expect(() => {
      const result = detector.detectAndDecode(emptyImage);
      expect(typeof result).toBe('string');
      expect(result).toBe(''); // Empty string for no QR code found
    }).not.toThrow();
    
    emptyImage.delete();
    detector.delete();
  });
});