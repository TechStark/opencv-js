import { Jimp } from "jimp";
import path from "path";
import { setupOpenCv, translateException } from "./cv";

beforeAll(setupOpenCv);

describe("Image loading in Node.js", () => {
  it("should NOT use cv.imread() in Node.js - it throws document is not defined", () => {
    // This test documents that cv.imread() does not work in Node.js
    expect(() => {
      cv.imread("Lenna.png");
    }).toThrow(/document is not defined/);
  });

  it("should use Jimp + matFromImageData pattern for loading images in Node.js", async () => {
    try {
      // CORRECT approach for Node.js: Use Jimp to load image
      const jimpImage = await Jimp.read(path.resolve(__dirname, "Lenna.png"));

      // Convert to OpenCV Mat
      const img = cv.matFromImageData(jimpImage.bitmap);

      // Verify the Mat was created successfully
      expect(img.rows).toBeGreaterThan(0);
      expect(img.cols).toBeGreaterThan(0);
      expect(img.channels()).toBe(4); // RGBA

      // Clean up
      img.delete();
    } catch (err) {
      throw translateException(err);
    }
  });

  it("should demonstrate complete Node.js image processing workflow", async () => {
    try {
      // Load image
      const jimpImage = await Jimp.read(path.resolve(__dirname, "Lenna.png"));
      const img = cv.matFromImageData(jimpImage.bitmap);

      // Convert to grayscale
      const gray = new cv.Mat();
      cv.cvtColor(img, gray, cv.COLOR_RGBA2GRAY);
      expect(gray.channels()).toBe(1);

      // Apply Gaussian blur
      const blurred = new cv.Mat();
      cv.GaussianBlur(
        gray,
        blurred,
        new cv.Size(5, 5),
        0,
        0,
        cv.BORDER_DEFAULT,
      );

      // Verify processing worked
      expect(blurred.rows).toBe(img.rows);
      expect(blurred.cols).toBe(img.cols);

      // Clean up
      img.delete();
      gray.delete();
      blurred.delete();
    } catch (err) {
      throw translateException(err);
    }
  });
});
