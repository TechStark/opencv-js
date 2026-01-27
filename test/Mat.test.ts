import { Jimp } from "jimp";
import path from "path";
import { setupOpenCv, translateException } from "./cv";

beforeAll(setupOpenCv);

describe("Mat", () => {
  it("shoud pass TS type validations", async () => {
    try {
      // load local image file with jimp. It supports jpg, png, bmp, tiff and gif:
      const jimpSrc = await Jimp.read(path.resolve(__dirname, "Lenna.png"));

      // `jimpImage.bitmap` property has the decoded ImageData that we can use to create a cv:Mat
      const img = cv.matFromImageData(jimpSrc.bitmap);
      expect(img.channels()).toEqual(4);

      const imgGray = new cv.Mat();
      cv.cvtColor(img, imgGray, cv.COLOR_RGBA2GRAY);
      expect(imgGray.channels()).toEqual(1);

      const imgBlur = new cv.Mat();
      cv.GaussianBlur(
        imgGray,
        imgBlur,
        new cv.Size(5, 5),
        0,
        0,
        cv.BORDER_DEFAULT,
      );

      const imgThresh = new cv.Mat();
      cv.threshold(
        imgBlur,
        imgThresh,
        0,
        255,
        cv.THRESH_BINARY + cv.THRESH_OTSU,
      );

      const contours = new cv.MatVector();
      const hierarchy = new cv.Mat();

      cv.findContours(
        imgThresh,
        contours,
        hierarchy,
        cv.RETR_CCOMP,
        cv.CHAIN_APPROX_SIMPLE,
      );

      const channels = new cv.MatVector();
      cv.split(img, channels);
      cv.merge(channels, img);
    } catch (err) {
      throw translateException(err);
    }
  });

  it("should allow ucharPtr with optional second parameter", async () => {
    try {
      // Create a simple test matrix
      const mat = new cv.Mat(3, 3, cv.CV_8UC1);
      
      // Test that ucharPtr works with just one parameter (row index)
      // This should compile without TypeScript errors due to optional j parameter
      const rowPtr = mat.ucharPtr(0);
      expect(rowPtr).toBeDefined();
      
      // Test that ucharPtr works with two parameters (row and column)
      const elementPtr = mat.ucharPtr(0, 0);
      expect(elementPtr).toBeDefined();
      
      mat.delete();
    } catch (err) {
      throw translateException(err);
    }
  });

  it("should test Mat.clone() behavior to reproduce issue #85", async () => {
    try {
      console.log("Testing Mat.clone() behavior...");
      
      // Create a 1x1 matrix with zeros
      const m1 = cv.Mat.zeros(1, 1, cv.CV_8U);
      const m2 = m1.clone();
      
      // Check initial values
      const m1_initial = m1.ucharAt(0);
      const m2_initial = m2.ucharAt(0);
      console.log(`Initial: m1 = ${m1_initial}, m2 = ${m2_initial}`);
      
      // Modify m1 through its data array
      m1.data[0] = 1;
      
      // Check values after modification
      const m1_after = m1.ucharAt(0);
      const m2_after = m2.ucharAt(0);
      console.log(`After modifying m1.data[0]: m1 = ${m1_after}, m2 = ${m2_after}`);
      
      // This test documents the current buggy behavior of clone()
      expect(m1_after).toBe(1);
      expect(m2_after).toBe(1); // Bug: clone() shares data
      
      m1.delete();
      m2.delete();
    } catch (err) {
      throw translateException(err);
    }
  });

  it("should test Mat.mat_clone() fixes the clone issue #85", async () => {
    try {
      console.log("Testing Mat.mat_clone() fix...");
      
      // Create a 1x1 matrix with zeros
      const m1 = cv.Mat.zeros(1, 1, cv.CV_8U);
      const m2 = m1.mat_clone();
      
      // Check initial values
      const m1_initial = m1.ucharAt(0);
      const m2_initial = m2.ucharAt(0);
      console.log(`Initial: m1 = ${m1_initial}, m2 = ${m2_initial}`);
      
      // Modify m1 through its data array
      m1.data[0] = 1;
      
      // Check values after modification
      const m1_after = m1.ucharAt(0);
      const m2_after = m2.ucharAt(0);
      console.log(`After modifying m1.data[0]: m1 = ${m1_after}, m2 = ${m2_after}`);
      
      // Expected behavior: m1 = 1, m2 = 0 (independent copies)
      expect(m1_after).toBe(1);
      expect(m2_after).toBe(0); // Fixed: mat_clone() creates independent copies
      
      m1.delete();
      m2.delete();
    } catch (err) {
      throw translateException(err);
    }
  });

  it("should test Mat.mat_clone() works with different Mat sizes and types", async () => {
    try {
      console.log("Testing Mat.mat_clone() with different types...");
      
      // Test with a 3x3 matrix of different type
      const m1 = cv.Mat.ones(3, 3, cv.CV_32F);
      const m2 = m1.mat_clone();
      
      // Verify dimensions and type are preserved
      expect(m2.rows).toBe(m1.rows);
      expect(m2.cols).toBe(m1.cols);
      expect(m2.type()).toBe(m1.type());
      
      // Modify first element of m1
      m1.data32F[0] = 42.5;
      
      // Check that m2 is not affected
      expect(m1.data32F[0]).toBe(42.5);
      expect(m2.data32F[0]).toBe(1.0); // Should remain original value
      
      m1.delete();
      m2.delete();
    } catch (err) {
      throw translateException(err);
    }
  });
});
