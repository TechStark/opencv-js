import { setupOpenCv } from "./cv";

beforeAll(setupOpenCv);

describe("Node.js Environment Compatibility", () => {
  test("should create Mat objects successfully in Node.js", () => {
    const mat = new cv.Mat(100, 100, cv.CV_8UC3, new cv.Scalar(255, 0, 0));
    expect(mat.rows).toBe(100);
    expect(mat.cols).toBe(100);
    expect(mat.channels()).toBe(3);
    mat.delete();
  });

  test("should throw clear error when calling imshow in Node.js", () => {
    const mat = new cv.Mat(10, 10, cv.CV_8UC1);
    expect(() => {
      cv.imshow("test", mat);
    }).toThrow(
      "cv.imshow() is only available in browser environments. It requires DOM API (canvas element) which is not available in Node.js. For Node.js, please use alternative methods like cv.imwrite() to save images to files."
    );
    mat.delete();
  });

  test("should throw clear error when calling VideoCapture in Node.js", () => {
    expect(() => {
      new cv.VideoCapture("test");
    }).toThrow(
      "cv.VideoCapture() is only available in browser environments. It requires DOM API (video element) which is not available in Node.js."
    );
  });

  test("should perform other OpenCV operations successfully in Node.js", () => {
    const mat = new cv.Mat(100, 100, cv.CV_8UC1);
    const result = new cv.Mat();
    
    // Test GaussianBlur
    cv.GaussianBlur(mat, result, new cv.Size(5, 5), 0);
    expect(result.rows).toBe(100);
    expect(result.cols).toBe(100);
    
    mat.delete();
    result.delete();
  });
});
