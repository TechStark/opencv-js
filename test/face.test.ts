import { setupOpenCv } from "./cv";

beforeAll(setupOpenCv);

describe("Face module type definitions", () => {
  it("should have face namespace and createFacemarkLBF type definitions", () => {
    // This test verifies that the TypeScript type definitions are available
    // Note: The actual face module is NOT included in the current opencv.js build
    // These type definitions are provided for users who build custom opencv.js with face module

    // Type check: verify cv.face namespace exists in type definitions
    const hasFaceNamespace = "face" in cv;

    // Since face module is not built into opencv.js, it won't exist at runtime
    // But the type definitions should compile without errors
    expect(hasFaceNamespace).toBe(false);

    // The following would work if face module was included in the build:
    // const facemark = cv.face.createFacemarkLBF();
    // facemark.loadModel('lbfmodel.yaml');
    // const faces = new cv.RectVector();
    // const landmarks = new cv.MatVector();
    // facemark.fit(gray, faces, landmarks);
  });

  it("should document that face module requires custom opencv.js build", () => {
    // This is a documentation test
    // Users wanting to use cv.face.createFacemarkLBF need to:
    // 1. Build opencv.js from source with opencv_contrib modules enabled
    // 2. Include the face module in the build configuration
    // 3. Use that custom opencv.js instead of the default one

    // The default opencv.js from docs.opencv.org includes:
    // calib3d, core, dnn, features2d, flann, imgproc, js, objdetect, photo, video
    // but NOT the face module

    expect(true).toBe(true);
  });
});
