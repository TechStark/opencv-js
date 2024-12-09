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
});
