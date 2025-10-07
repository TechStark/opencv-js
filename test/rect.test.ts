import { setupOpenCv } from "./cv";

beforeAll(setupOpenCv);

describe("rect", () => {
  it("test rotated rect", async () => {
    const point = new cv.Point(100, 200);
    const size = new cv.Size(200, 300);
    const rect = new cv.RotatedRect(point, size, 30);

    const points = cv.RotatedRect.points(rect);

    expect(points[0].x).toBe(cv.RotatedRect.boundingRect2f(rect).x);
    expect(points[1].y).toBe(cv.RotatedRect.boundingRect2f(rect).y);

    expect(Math.round(points[0].x)).toBe(cv.RotatedRect.boundingRect(rect).x);
    expect(Math.round(points[1].y)).toBe(cv.RotatedRect.boundingRect(rect).y);
  });

  it("test boxPoints function", async () => {
    const center = new cv.Point(50, 40);
    const size = new cv.Size(80, 30);
    const angle = 25;
    const rotatedRect = new cv.RotatedRect(center, size, angle);

    // Test that boxPoints accepts one argument and returns Point2f[]
    const points = cv.boxPoints(rotatedRect);

    // Verify it returns an array
    expect(Array.isArray(points)).toBe(true);

    // Verify it returns 4 points
    expect(points.length).toBe(4);

    // Verify each point has x and y properties
    points.forEach((point) => {
      expect(typeof point.x).toBe("number");
      expect(typeof point.y).toBe("number");
    });

    // Verify the points are reasonable (not all zeros)
    const hasNonZero = points.some((point) => point.x !== 0 || point.y !== 0);
    expect(hasNonZero).toBe(true);
  });
});
