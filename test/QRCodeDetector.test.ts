import { Jimp } from "jimp";
import path from "path";
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

  it("should detect and decode QR code from image", async () => {
    const detector = new cv.QRCodeDetector();
    
    try {
      // Load the test QR code image
      const jimpSrc = await Jimp.read(path.resolve(__dirname, "test-qr.png"));
      const img = cv.matFromImageData(jimpSrc.bitmap);
      
      // Convert RGBA to BGR as OpenCV expects BGR format
      const imgBGR = new cv.Mat();
      cv.cvtColor(img, imgBGR, cv.COLOR_RGBA2BGR);
      
      // Test detectAndDecode method
      const points = new cv.Mat();
      const decodedText = detector.detectAndDecode(imgBGR, points);
      
      // Verify the decoded text matches what we encoded
      expect(decodedText).toBe("Hello OpenCV.js QR Test!");
      
      // Verify points were detected (should have 4 corner points)
      expect(points.rows).toBeGreaterThan(0);
      expect(points.cols).toBeGreaterThan(0);
      
      // Clean up
      img.delete();
      imgBGR.delete();
      points.delete();
    } finally {
      detector.delete();
    }
  });

  it("should detect QR code corners using detect method", async () => {
    const detector = new cv.QRCodeDetector();
    
    try {
      // Load the test QR code image
      const jimpSrc = await Jimp.read(path.resolve(__dirname, "test-qr.png"));
      const img = cv.matFromImageData(jimpSrc.bitmap);
      
      // Convert RGBA to BGR as OpenCV expects BGR format
      const imgBGR = new cv.Mat();
      cv.cvtColor(img, imgBGR, cv.COLOR_RGBA2BGR);
      
      // Test detect method
      const points = new cv.Mat();
      const detected = detector.detect(imgBGR, points);
      
      // Verify QR code was detected
      expect(detected).toBe(true);
      expect(points.rows).toBeGreaterThan(0);
      expect(points.cols).toBeGreaterThan(0);
      
      // Clean up
      img.delete();
      imgBGR.delete();
      points.delete();
    } finally {
      detector.delete();
    }
  });

  it("should decode previously detected QR code using decode method", async () => {
    const detector = new cv.QRCodeDetector();
    
    try {
      // Load the test QR code image
      const jimpSrc = await Jimp.read(path.resolve(__dirname, "test-qr.png"));
      const img = cv.matFromImageData(jimpSrc.bitmap);
      
      // Convert RGBA to BGR as OpenCV expects BGR format
      const imgBGR = new cv.Mat();
      cv.cvtColor(img, imgBGR, cv.COLOR_RGBA2BGR);
      
      // First detect the QR code
      const points = new cv.Mat();
      const detected = detector.detect(imgBGR, points);
      expect(detected).toBe(true);
      
      // Then decode it using the detected points
      const decodedText = detector.decode(imgBGR, points);
      expect(decodedText).toBe("Hello OpenCV.js QR Test!");
      
      // Clean up
      img.delete();
      imgBGR.delete();
      points.delete();
    } finally {
      detector.delete();
    }
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

  it("should detect and decode QR code from image using Aruco detector", async () => {
    const detector = new cv.QRCodeDetectorAruco();
    
    try {
      // Load the test QR code image
      const jimpSrc = await Jimp.read(path.resolve(__dirname, "test-qr.png"));
      const img = cv.matFromImageData(jimpSrc.bitmap);
      
      // Convert RGBA to BGR as OpenCV expects BGR format
      const imgBGR = new cv.Mat();
      cv.cvtColor(img, imgBGR, cv.COLOR_RGBA2BGR);
      
      // Test detectAndDecode method
      const points = new cv.Mat();
      const decodedText = detector.detectAndDecode(imgBGR, points);
      
      // Verify the decoded text matches what we encoded
      expect(decodedText).toBe("Hello OpenCV.js QR Test!");
      
      // Verify points were detected
      expect(points.rows).toBeGreaterThan(0);
      expect(points.cols).toBeGreaterThan(0);
      
      // Clean up
      img.delete();
      imgBGR.delete();
      points.delete();
    } finally {
      detector.delete();
    }
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

  it("should be able to clean up params", () => {
    const params = new cv.QRCodeDetectorAruco_Params();
    // Just verify we can call delete without errors
    expect(() => params.delete()).not.toThrow();
  });
});