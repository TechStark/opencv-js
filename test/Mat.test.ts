import "../src";

beforeAll(async () => {
  return new Promise((resolve) => {
    const _cv = require("../dist/opencv");
    _cv.onRuntimeInitialized = resolve;
    global.cv = _cv;
  });
});

describe("Mat", () => {
  it("shoud pass TS type validations", () => {
    try {
      const img = new cv.Mat();

      const imgGray = new cv.Mat();
      cv.cvtColor(img, imgGray, cv.COLOR_RGBA2GRAY);

      const imgBlur = new cv.Mat();
      cv.GaussianBlur(
        imgGray,
        imgBlur,
        new cv.Size(5, 5),
        0,
        0,
        cv.BORDER_DEFAULT,
      );

      const imgThresh = new cv.Mat();
      cv.threshold(
        imgBlur,
        imgThresh,
        0,
        255,
        cv.THRESH_BINARY + cv.THRESH_OTSU,
      );

      const contours = new cv.MatVector();
      const hierarchy = new cv.Mat();

      cv.findContours(
        imgThresh,
        contours,
        hierarchy,
        cv.RETR_CCOMP,
        cv.CHAIN_APPROX_SIMPLE,
      );

      const channels = new cv.MatVector();
      cv.split(img, channels);
      cv.merge(channels, img);
    } catch (err) {
      if (typeof err === "number") {
        const error = cv.exceptionFromPtr(err);
        throw error;
      } else {
        throw err;
      }
    }
  });
});
