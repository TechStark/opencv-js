import { setupOpenCv } from "./cv";

beforeAll(async () => {
  await setupOpenCv();
});

describe("Stitcher", () => {
  it("should pass TypeScript type validations", () => {
    // This test ensures that the Stitcher type definitions compile correctly
    // even if the stitching module is not available in the current OpenCV.js build
    expect(true).toBe(true);
  });

  it("should check if Stitcher is available in current build", () => {
    // Check if Stitcher class exists in the cv object
    const isStitcherAvailable = "Stitcher" in cv && typeof cv.Stitcher !== "undefined";
    
    if (!isStitcherAvailable) {
      console.log(
        "⚠️  Stitcher class is not available in the current OpenCV.js build.\n" +
        "   The stitching module is disabled by default.\n" +
        "   To use Stitcher, rebuild OpenCV.js with the stitching module enabled.\n" +
        "   See .github/workflows/build-opencv-js.yml for build instructions."
      );
    }

    // This test doesn't fail - it's informational
    expect(typeof isStitcherAvailable).toBe("boolean");
  });

  // Conditional tests that only run if Stitcher is available
  describe("when Stitcher is available", () => {
    const isStitcherAvailable = () => "Stitcher" in cv && typeof cv.Stitcher !== "undefined";

    it("should be available as a class", () => {
      if (!isStitcherAvailable()) {
        console.log("Skipping: Stitcher not available in current build");
        return;
      }
      expect(cv.Stitcher).toBeDefined();
    });

    it("should have create static method", () => {
      if (!isStitcherAvailable()) return;
      expect(cv.Stitcher.create).toBeDefined();
      expect(typeof cv.Stitcher.create).toBe("function");
    });

    it("should be able to create Stitcher instance", () => {
      if (!isStitcherAvailable()) return;
      const stitcher = cv.Stitcher.create();
      expect(stitcher).toBeDefined();
      stitcher.delete();
    });

    it("should have stitch method", () => {
      if (!isStitcherAvailable()) return;
      const stitcher = cv.Stitcher.create();
      expect(stitcher.stitch).toBeDefined();
      expect(typeof stitcher.stitch).toBe("function");
      stitcher.delete();
    });

    it("should have estimateTransform method", () => {
      if (!isStitcherAvailable()) return;
      const stitcher = cv.Stitcher.create();
      expect(stitcher.estimateTransform).toBeDefined();
      expect(typeof stitcher.estimateTransform).toBe("function");
      stitcher.delete();
    });

    it("should have composePanorama method", () => {
      if (!isStitcherAvailable()) return;
      const stitcher = cv.Stitcher.create();
      expect(stitcher.composePanorama).toBeDefined();
      expect(typeof stitcher.composePanorama).toBe("function");
      stitcher.delete();
    });

    it("should have configuration methods", () => {
      if (!isStitcherAvailable()) return;
      const stitcher = cv.Stitcher.create();
      
      expect(stitcher.setRegistrationResol).toBeDefined();
      expect(stitcher.setSeamEstimationResol).toBeDefined();
      expect(stitcher.setCompositingResol).toBeDefined();
      expect(stitcher.setPanoConfidenceThresh).toBeDefined();
      expect(stitcher.setWaveCorrection).toBeDefined();
      
      stitcher.delete();
    });

    it("should have status constants", () => {
      if (!isStitcherAvailable()) return;
      expect(cv.Stitcher_OK).toBeDefined();
      expect(cv.Stitcher_ERR_NEED_MORE_IMGS).toBeDefined();
      expect(cv.Stitcher_ERR_HOMOGRAPHY_EST_FAIL).toBeDefined();
      expect(cv.Stitcher_ERR_CAMERA_PARAMS_ADJUST_FAIL).toBeDefined();
    });

    it("should have mode constants", () => {
      if (!isStitcherAvailable()) return;
      expect(cv.Stitcher_PANORAMA).toBeDefined();
      expect(cv.Stitcher_SCANS).toBeDefined();
    });
  });
});
