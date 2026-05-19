import { setupOpenCv, translateException } from "./cv";

beforeAll(setupOpenCv);

describe("connectedComponentsWithStats", () => {
  it("should return correct stats and centroids for a binary image", async () => {
    try {
      // Create a small binary image with two distinct blobs:
      //   blob A: 2x2 block at top-left (rows 0-1, cols 0-1)
      //   blob B: 2x2 block at bottom-right (rows 3-4, cols 3-4)
      // Image is 5 rows x 5 cols, all zeros except the two blobs.
      const rows = 5;
      const cols = 5;
      const src = new cv.Mat(rows, cols, cv.CV_8UC1, new cv.Scalar(0));

      // Set blob A pixels
      src.data[0 * cols + 0] = 255;
      src.data[0 * cols + 1] = 255;
      src.data[1 * cols + 0] = 255;
      src.data[1 * cols + 1] = 255;

      // Set blob B pixels
      src.data[3 * cols + 3] = 255;
      src.data[3 * cols + 4] = 255;
      src.data[4 * cols + 3] = 255;
      src.data[4 * cols + 4] = 255;

      const labels = new cv.Mat();
      const stats = new cv.Mat();
      const centroids = new cv.Mat();

      const numLabels = cv.connectedComponentsWithStats(
        src,
        labels,
        stats,
        centroids,
      );

      // 1 background + 2 blobs
      expect(numLabels).toBe(3);

      // stats has shape (numLabels, 5) of type CV_32S
      expect(stats.rows).toBe(numLabels);
      expect(stats.cols).toBe(cv.CC_STAT_MAX);

      // centroids has shape (numLabels, 2) of type CV_64F
      expect(centroids.rows).toBe(numLabels);
      expect(centroids.cols).toBe(2);

      // Collect stats for each foreground component (labels 1 and 2)
      const components: {
        x: number;
        y: number;
        w: number;
        h: number;
        area: number;
        cx: number;
        cy: number;
      }[] = [];
      for (let i = 1; i < numLabels; i++) {
        components.push({
          x: stats.intAt(i, cv.CC_STAT_LEFT),
          y: stats.intAt(i, cv.CC_STAT_TOP),
          w: stats.intAt(i, cv.CC_STAT_WIDTH),
          h: stats.intAt(i, cv.CC_STAT_HEIGHT),
          area: stats.intAt(i, cv.CC_STAT_AREA),
          cx: centroids.doubleAt(i, 0),
          cy: centroids.doubleAt(i, 1),
        });
      }

      // Sort by x so the test is deterministic regardless of label assignment
      components.sort((a, b) => a.x - b.x);

      // Blob A: top-left 2x2
      expect(components[0].x).toBe(0);
      expect(components[0].y).toBe(0);
      expect(components[0].w).toBe(2);
      expect(components[0].h).toBe(2);
      expect(components[0].area).toBe(4);
      expect(components[0].cx).toBeCloseTo(0.5);
      expect(components[0].cy).toBeCloseTo(0.5);

      // Blob B: bottom-right 2x2
      expect(components[1].x).toBe(3);
      expect(components[1].y).toBe(3);
      expect(components[1].w).toBe(2);
      expect(components[1].h).toBe(2);
      expect(components[1].area).toBe(4);
      expect(components[1].cx).toBeCloseTo(3.5);
      expect(components[1].cy).toBeCloseTo(3.5);

      src.delete();
      labels.delete();
      stats.delete();
      centroids.delete();
    } catch (err) {
      throw translateException(err);
    }
  });
});
