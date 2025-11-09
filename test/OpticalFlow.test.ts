import { Jimp } from "jimp";
import path from "path";
import { setupOpenCv, translateException } from "./cv";

beforeAll(setupOpenCv);

describe("Optical Flow", () => {
  it("should calculate optical flow with calcOpticalFlowPyrLK correctly", async () => {
    try {
      // Load test image
      const jimpSrc = await Jimp.read(path.resolve(__dirname, "Lenna.png"));
      const img = cv.matFromImageData(jimpSrc.bitmap);

      // Convert to grayscale
      const gray = new cv.Mat();
      cv.cvtColor(img, gray, cv.COLOR_RGBA2GRAY);

      // Detect good features to track
      const corners = new cv.Mat();
      const maxCorners = 100;
      const qualityLevel = 0.01;
      const minDistance = 10;
      cv.goodFeaturesToTrack(
        gray,
        corners,
        maxCorners,
        qualityLevel,
        minDistance
      );

      // For optical flow, we need two images
      // For this test, we'll use the same image (in practice you'd use consecutive frames)
      const prevGray = gray;
      const curGray = gray.clone();

      // Convert corners to the right format for calcOpticalFlowPyrLK
      // prevPts should be a Mat with type CV_32FC2
      const prevPts = new cv.Mat(corners.rows, 1, cv.CV_32FC2);
      for (let i = 0; i < corners.rows; i++) {
        prevPts.data32F[i * 2] = corners.data32F[i * 2];
        prevPts.data32F[i * 2 + 1] = corners.data32F[i * 2 + 1];
      }

      // Output arrays
      const nextPts = new cv.Mat();
      const status = new cv.Mat();
      const err = new cv.Mat(); // This is an OUTPUT array, NOT an exception pointer!

      // Optional parameters
      const winSize = new cv.Size(15, 15);
      const maxLevel = 2;
      const criteria = new cv.TermCriteria(
        cv.TermCriteria_EPS | cv.TermCriteria_COUNT,
        10,
        0.03
      );

      // Calculate optical flow
      // This may throw an exception if inputs are invalid
      cv.calcOpticalFlowPyrLK(
        prevGray,
        curGray,
        prevPts,
        nextPts,
        status,
        err, // This is where error metrics are stored, NOT an exception pointer
        winSize,
        maxLevel,
        criteria
      );

      // Verify results
      expect(nextPts.rows).toBeGreaterThan(0);
      expect(status.rows).toBe(nextPts.rows);
      expect(err.rows).toBe(nextPts.rows); // err contains error metrics for each point

      // Check that we have some successfully tracked points
      let successCount = 0;
      for (let i = 0; i < status.rows; i++) {
        if (status.data[i] === 1) {
          successCount++;
        }
      }
      expect(successCount).toBeGreaterThan(0);

      // Clean up
      img.delete();
      gray.delete();
      curGray.delete();
      corners.delete();
      prevPts.delete();
      nextPts.delete();
      status.delete();
      err.delete();
    } catch (error) {
      // Properly handle exceptions from OpenCV
      throw translateException(error);
    }
  });

  it("should throw exception when calcOpticalFlowPyrLK receives invalid inputs", async () => {
    // Create invalid inputs to trigger an error
    const prevGray = new cv.Mat(100, 100, cv.CV_8UC1);
    const curGray = new cv.Mat(100, 100, cv.CV_8UC1);
    const prevPts = new cv.Mat(0, 1, cv.CV_32FC2); // Empty points - this is invalid
    const nextPts = new cv.Mat();
    const status = new cv.Mat();
    const err = new cv.Mat();

    const winSize = new cv.Size(15, 15);
    const maxLevel = 2;
    const criteria = new cv.TermCriteria(
      cv.TermCriteria_EPS | cv.TermCriteria_COUNT,
      10,
      0.03
    );

    // This should throw an exception because of invalid input format
    expect(() => {
      cv.calcOpticalFlowPyrLK(
        prevGray,
        curGray,
        prevPts,
        nextPts,
        status,
        err,
        winSize,
        maxLevel,
        criteria
      );
    }).toThrow();

    // Clean up
    prevGray.delete();
    curGray.delete();
    prevPts.delete();
    nextPts.delete();
    status.delete();
    err.delete();
  });
});
