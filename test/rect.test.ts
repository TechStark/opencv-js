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

    // Verify it returns 4 points
    expect(points.length).toBe(4);

    // Check the actual values - boxPoints should return the same result as RotatedRect.points
    const expectedPoints = cv.RotatedRect.points(rotatedRect);
    expect(points[0].x).toBeCloseTo(expectedPoints[0].x, 5);
    expect(points[0].y).toBeCloseTo(expectedPoints[0].y, 5);
    expect(points[1].x).toBeCloseTo(expectedPoints[1].x, 5);
    expect(points[1].y).toBeCloseTo(expectedPoints[1].y, 5);
    expect(points[2].x).toBeCloseTo(expectedPoints[2].x, 5);
    expect(points[2].y).toBeCloseTo(expectedPoints[2].y, 5);
    expect(points[3].x).toBeCloseTo(expectedPoints[3].x, 5);
    expect(points[3].y).toBeCloseTo(expectedPoints[3].y, 5);
  });
});
