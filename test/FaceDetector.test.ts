import { Jimp } from "jimp";
import * as fs from "fs";
import path from "path";
import { setupOpenCv } from "./cv";

const MODEL_FILENAME = "face_detection_yunet_2023mar.onnx";
const FIXTURES = path.resolve(__dirname, "fixtures");

beforeAll(async () => {
  await setupOpenCv();
  // Mount model into the Emscripten virtual filesystem
  const data = new Uint8Array(
    fs.readFileSync(path.resolve(FIXTURES, MODEL_FILENAME))
  );
  cv.FS_createDataFile("/", MODEL_FILENAME, data, true, false, false);
});

describe("FaceDetectorYN", () => {
  it("should be available as a class", () => {
    expect(cv.FaceDetectorYN).toBeDefined();
    expect(typeof cv.FaceDetectorYN).toBe("function");
  });

  it("should have expected instance methods", () => {
    const detector = new cv.FaceDetectorYN(MODEL_FILENAME, "", new cv.Size(320, 320));
    try {
      expect(typeof detector.detect).toBe("function");
      expect(typeof detector.setInputSize).toBe("function");
      expect(typeof detector.setScoreThreshold).toBe("function");
      expect(typeof detector.setNMSThreshold).toBe("function");
      expect(typeof detector.setTopK).toBe("function");
      expect(typeof detector.getInputSize).toBe("function");
      expect(typeof detector.getScoreThreshold).toBe("function");
      expect(typeof detector.getNMSThreshold).toBe("function");
      expect(typeof detector.getTopK).toBe("function");
    } finally {
      detector.delete();
    }
  });

  it("should respect score threshold set via constructor", () => {
    const detector = new cv.FaceDetectorYN(MODEL_FILENAME, "", new cv.Size(320, 320), 0.75);
    try {
      expect(detector.getScoreThreshold()).toBeCloseTo(0.75, 2);
    } finally {
      detector.delete();
    }
  });

  it("should respect nms threshold set via constructor", () => {
    const detector = new cv.FaceDetectorYN(MODEL_FILENAME, "", new cv.Size(320, 320), 0.6, 0.4);
    try {
      expect(detector.getNMSThreshold()).toBeCloseTo(0.4, 2);
    } finally {
      detector.delete();
    }
  });

  it("should update input size via setInputSize", () => {
    const detector = new cv.FaceDetectorYN(MODEL_FILENAME, "", new cv.Size(320, 320));
    try {
      detector.setInputSize(new cv.Size(640, 480));
      const sz = detector.getInputSize();
      expect(sz.width).toBe(640);
      expect(sz.height).toBe(480);
    } finally {
      detector.delete();
    }
  });

  it("should detect face in Lenna image", async () => {
    const imgPath = path.resolve(FIXTURES, "Lenna.png");
    const jimpSrc = await Jimp.read(imgPath);
    const { width, height } = jimpSrc.bitmap;

    const img = cv.matFromImageData(jimpSrc.bitmap);
    const bgr = new cv.Mat();
    cv.cvtColor(img, bgr, cv.COLOR_RGBA2BGR);

    const detector = new cv.FaceDetectorYN(
      MODEL_FILENAME,
      "",
      new cv.Size(width, height),
      0.6,
      0.3,
      5000
    );
    const faces = new cv.Mat();

    try {
      detector.detect(bgr, faces);

      // Lenna contains exactly one frontal face
      expect(faces.rows).toBe(1);

      // Each row has 15 columns:
      // [x, y, w, h, re_x, re_y, le_x, le_y, nose_x, nose_y, mr_x, mr_y, ml_x, ml_y, score]
      expect(faces.cols).toBe(15);

      const x = faces.floatAt(0, 0);
      const y = faces.floatAt(0, 1);
      const w = faces.floatAt(0, 2);
      const h = faces.floatAt(0, 3);
      const score = faces.floatAt(0, 14);

      expect(x).toBeGreaterThan(0);
      expect(y).toBeGreaterThan(0);
      expect(w).toBeGreaterThan(0);
      expect(h).toBeGreaterThan(0);
      expect(score).toBeGreaterThan(0.6);

      // Bounding box must stay within image bounds
      expect(x + w).toBeLessThanOrEqual(width);
      expect(y + h).toBeLessThanOrEqual(height);
    } finally {
      img.delete();
      bgr.delete();
      faces.delete();
      detector.delete();
    }
  });

  it("should return no detections for blank image", () => {
    const blank = new cv.Mat(320, 320, cv.CV_8UC3, new cv.Scalar(128, 128, 128));
    const detector = new cv.FaceDetectorYN(MODEL_FILENAME, "", new cv.Size(320, 320));
    const faces = new cv.Mat();

    try {
      detector.detect(blank, faces);
      expect(faces.rows).toBe(0);
    } finally {
      blank.delete();
      faces.delete();
      detector.delete();
    }
  });
});
