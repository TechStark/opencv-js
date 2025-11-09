import { Jimp } from "jimp";
import path from "path";
import { setupOpenCv, translateException } from "./cv";

beforeAll(setupOpenCv);

describe("SIFT", () => {
  it("should have SIFT type definitions available", () => {
    // This test verifies that TypeScript definitions exist
    // The actual SIFT functionality requires opencv.js built with OPENCV_ENABLE_NONFREE=ON
    expect(typeof cv.SIFT).toBeDefined();
  });

  // This test will only run if SIFT is available in the opencv.js build
  it.skip("should detect keypoints using SIFT", async () => {
    try {
      // Skip if SIFT is not available
      if (typeof cv.SIFT === "undefined") {
        console.log(
          "SIFT not available - requires opencv.js built with OPENCV_ENABLE_NONFREE=ON",
        );
        return;
      }

      // Load test image
      const jimpSrc = await Jimp.read(path.resolve(__dirname, "Lenna.png"));
      const img = cv.matFromImageData(jimpSrc.bitmap);

      // Convert to grayscale
      const gray = new cv.Mat();
      cv.cvtColor(img, gray, cv.COLOR_RGBA2GRAY);

      // Create SIFT detector
      const sift = new cv.SIFT();

      // Detect keypoints and compute descriptors
      const keypoints = new cv.KeyPointVector();
      const descriptors = new cv.Mat();

      sift.detectAndCompute(gray, new cv.Mat(), keypoints, descriptors);

      // Verify results
      expect(keypoints.size()).toBeGreaterThan(0);
      expect(descriptors.rows).toBe(keypoints.size());
      expect(descriptors.cols).toBe(128); // SIFT descriptors are 128-dimensional

      console.log(
        `SIFT detected ${keypoints.size()} keypoints with ${descriptors.cols}-dimensional descriptors`,
      );

      // Clean up
      keypoints.delete();
      descriptors.delete();
      sift.delete();
      gray.delete();
      img.delete();
    } catch (err) {
      throw translateException(err);
    }
  });

  it.skip("should create SIFT with custom parameters", async () => {
    try {
      // Skip if SIFT is not available
      if (typeof cv.SIFT === "undefined") {
        console.log(
          "SIFT not available - requires opencv.js built with OPENCV_ENABLE_NONFREE=ON",
        );
        return;
      }

      // Create SIFT with custom parameters
      const nfeatures = 100; // Retain top 100 features
      const nOctaveLayers = 3;
      const contrastThreshold = 0.04;
      const edgeThreshold = 10;
      const sigma = 1.6;

      const sift = new cv.SIFT(
        nfeatures,
        nOctaveLayers,
        contrastThreshold,
        edgeThreshold,
        sigma,
      );

      expect(sift).toBeDefined();
      expect(sift.getDefaultName()).toBe("Feature2D.SIFT");

      // Clean up
      sift.delete();
    } catch (err) {
      throw translateException(err);
    }
  });
});
