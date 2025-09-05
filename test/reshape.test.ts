import { setupOpenCv, translateException } from "./cv";

beforeAll(setupOpenCv);

describe("Mat.reshape", () => {
  it("should fix the original issue", async () => {
    try {
      // Create a simple test matrix
      const origImg = new cv.Mat(4, 4, cv.CV_8UC4); // 4x4 RGBA image
      const img = new cv.Mat();
      cv.cvtColor(origImg, img, cv.COLOR_RGBA2RGB); // Convert to RGB (3 channels)
      
      // This should now work (not throw "img.reshape is not a function")
      expect(() => {
        const vectorized = img.reshape(-1, 3);
        vectorized.delete();
      }).not.toThrow("img.reshape is not a function");
      
      origImg.delete();
      img.delete();
    } catch (err) {
      throw translateException(err);
    }
  });

  it("should implement reshape functionality", async () => {
    try {
      // Create a 2x3 matrix with 2 channels (12 elements total)
      const mat = new cv.Mat(2, 3, cv.CV_8UC2);
      
      // Fill with test data
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 3; j++) {
          mat.ucharPtr(i, j)[0] = i * 6 + j * 2; // First channel
          mat.ucharPtr(i, j)[1] = i * 6 + j * 2 + 1; // Second channel
        }
      }
      
      // Test reshape: convert 2x3x2 to 3x2x2 (same total elements)
      const reshaped = mat.reshape(2, 3);
      
      expect(reshaped.rows).toBe(3);
      expect(reshaped.cols).toBe(2);
      expect(reshaped.channels()).toBe(2);
      expect(reshaped.total() * reshaped.channels()).toBe(mat.total() * mat.channels());
      
      // Test reshape with auto-calculated channels: total=12, rows=3, so 4 elements per row
      // With -1 (auto-calculate), it should default to 1 channel, so 3x4x1
      const reshaped2 = mat.reshape(-1, 3); 
      
      expect(reshaped2.rows).toBe(3);
      expect(reshaped2.cols).toBe(4); // 12 total elements / 3 rows / 1 channel = 4 cols
      expect(reshaped2.channels()).toBe(1); // Auto-calculated as 1 channel
      
      mat.delete();
      reshaped.delete();
      reshaped2.delete();
    } catch (err) {
      throw translateException(err);
    }
  });

  it("should handle edge cases", async () => {
    try {
      // Test with 1D vector
      const mat = new cv.Mat(1, 6, cv.CV_8UC1);
      
      // Reshape to 2x3
      const reshaped = mat.reshape(1, 2);
      expect(reshaped.rows).toBe(2);
      expect(reshaped.cols).toBe(3);
      expect(reshaped.channels()).toBe(1);
      
      // Test invalid reshape (mismatched total elements)
      expect(() => {
        mat.reshape(1, 5); // 1*5 = 5, but original has 6 elements
      }).toThrow();
      
      mat.delete();
      reshaped.delete();
    } catch (err) {
      throw translateException(err);
    }
  });
});