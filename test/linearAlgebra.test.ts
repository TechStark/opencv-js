import { setupOpenCv } from "./cv";

beforeAll(setupOpenCv);

describe("Linear Algebra Functions", () => {
  it("should have solve, invert, and eigen functions", () => {
    // These functions are available in opencv.js
    expect(typeof cv.solve).toBe("function");
    expect(typeof cv.invert).toBe("function");
    expect(typeof cv.eigen).toBe("function");
  });

  it("should have DECOMP constants", () => {
    // DECOMP constants are available
    expect(cv.DECOMP_LU).toBe(0);
    expect(cv.DECOMP_SVD).toBe(1);
    expect(cv.DECOMP_EIG).toBe(2);
    expect(cv.DECOMP_CHOLESKY).toBe(3);
    expect(cv.DECOMP_QR).toBe(4);
    expect(cv.DECOMP_NORMAL).toBe(16);
  });

  it("should NOT have SVDecomp and SVBackSubst functions", () => {
    // SVDecomp and SVBackSubst are not compiled into opencv.js
    // These functions were incorrectly included in TypeScript definitions before
    // Using bracket notation to avoid TypeScript compilation errors
    expect((cv as any)["SVDecomp"]).toBeUndefined();
    expect((cv as any)["SVBackSubst"]).toBeUndefined();
  });

  it("should demonstrate solve function works", () => {
    // Create a simple 2x2 linear system and verify solve can be called
    // Using arbitrary matrix values just to test the function executes
    const A = cv.matFromArray(2, 2, cv.CV_64F, [2, 1, 1, 3]);
    const b = cv.matFromArray(2, 1, cv.CV_64F, [5, 6]);
    const x = new cv.Mat();

    const result = cv.solve(A, b, x, cv.DECOMP_LU);

    // Just verify the function executes without error
    expect(typeof result).toBe("boolean");
    expect(x.rows).toBe(2);
    expect(x.cols).toBe(1);

    // Clean up
    A.delete();
    b.delete();
    x.delete();
  });

  it("should demonstrate invert function works", () => {
    // Create a simple invertible 2x2 matrix to test the function
    // Using arbitrary matrix values just to test the function executes
    const A = cv.matFromArray(2, 2, cv.CV_64F, [4, 7, 2, 6]);
    const Ainv = new cv.Mat();

    const det = cv.invert(A, Ainv, cv.DECOMP_LU);

    // Just verify the function executes without error
    expect(typeof det).toBe("number");
    expect(Ainv.rows).toBe(2);
    expect(Ainv.cols).toBe(2);

    // Clean up
    A.delete();
    Ainv.delete();
  });
});
