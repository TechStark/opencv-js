const cvModule = require("./dist/opencv.js");

async function getOpenCv() {
  let cv;
  if (cvModule instanceof Promise) {
    cv = await cvModule;
  } else {
    await new Promise((resolve) => {
      cvModule.onRuntimeInitialized = () => resolve(1);
    });
    cv = cvModule;
  }
  return { cv };
}

async function main() {
  const { cv } = await getOpenCv();
  console.log("OpenCV.js is ready!");
  // You can now use OpenCV functions here
  console.log("Creating mat...");
  let mat = new cv.Mat(100, 100, cv.CV_8UC3, new cv.Scalar(255, 0, 0));
  console.log("Mat created successfully");
  
  // This should cause the crash
  try {
    console.log("Attempting imshow...");
    cv.imshow("mat:", mat);
  } catch (e) {
    console.log("Error caught:", e.message);
  } finally {
    mat.delete();
  }
}

main();
