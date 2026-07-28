import { setupOpenCv, translateException } from "./cv";

beforeAll(setupOpenCv);

describe("cv.divide overloading", () => {
  it("should correctly call array-by-array divide", () => {
    try {
      // Test array-by-array division
      const src1 = cv.Mat.ones(3, 3, cv.CV_32F);
      const src2 = new cv.Mat(3, 3, cv.CV_32F);
      src2.setTo(new cv.Scalar(2));
      const dst = new cv.Mat();
      
      cv.divide(src1, src2, dst);
      
      // Result should be 1/2 = 0.5 for all elements
      expect(dst.data32F[0]).toBeCloseTo(0.5, 5);
      
      src1.delete();
      src2.delete();
      dst.delete();
    } catch (err) {
      throw translateException(err);
    }
  });

  it("should correctly call array-by-array divide with scale parameter", () => {
    try {
      // Test array-by-array division with explicit scale
      const src1 = cv.Mat.ones(3, 3, cv.CV_32F);
      const src2 = new cv.Mat(3, 3, cv.CV_32F);
      src2.setTo(new cv.Scalar(2));
      const dst = new cv.Mat();
      
      // Result should be 1 * 10 / 2 = 5 for all elements
      cv.divide(src1, src2, dst, 10);
      
      expect(dst.data32F[0]).toBeCloseTo(5, 5);
      
      src1.delete();
      src2.delete();
      dst.delete();
    } catch (err) {
      throw translateException(err);
    }
  });

  it("should achieve scalar-by-array division using Mat.ones with scale", () => {
    try {
      // To divide a scalar by an array: create a ones matrix and use scale parameter
      // This is the workaround for the pattern from the issue
      const srcStd = 0.5;
      const sourceNormalized = new cv.Mat(3, 3, cv.CV_32F);
      sourceNormalized.setTo(new cv.Scalar(2));
      
      // To achieve: (1/srcStd) / sourceNormalized
      // Use: ones / sourceNormalized with scale = (1/srcStd)
      const ones = cv.Mat.ones(3, 3, cv.CV_32F);
      cv.divide(ones, sourceNormalized, sourceNormalized, 1 / srcStd);
      
      // Result should be (1/0.5) * 1 / 2 = 2 / 2 = 1 for all elements
      expect(sourceNormalized.data32F[0]).toBeCloseTo(1, 5);
      
      ones.delete();
      sourceNormalized.delete();
    } catch (err) {
      throw translateException(err);
    }
  });

  it("should not accept scalar as first parameter (TypeScript should catch this)", () => {
    try {
      const src = new cv.Mat(2, 2, cv.CV_32F);
      src.setTo(new cv.Scalar(2));
      const dst = new cv.Mat();
      
      // This should not compile in TypeScript (but we can't test that at runtime)
      // If someone bypasses TypeScript, it will throw at runtime
      expect(() => {
        // @ts-expect-error - Testing that TypeScript prevents this
        cv.divide(10, src, dst);
      }).toThrow();
      
      src.delete();
      dst.delete();
    } catch (err) {
      throw translateException(err);
    }
  });
});

