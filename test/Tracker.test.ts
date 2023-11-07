import Jimp from "jimp";
import path from "path";
import { setupOpenCv, translateException } from "./cv";

beforeAll(setupOpenCv);

describe("Tracker", () => {
  it("shoud pass TS type validations", async () => {
    try {
      const tracker = new cv.TrackerMIL();
    } catch (err) {
      throw translateException(err);
    }
  });
});
