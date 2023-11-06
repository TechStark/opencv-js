import * as cv from "../src";

describe("Mat", () => {
  it("shoud pass TS type validations", () => {
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
    cv.threshold(imgBlur, imgThresh, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU);

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
  });
});
