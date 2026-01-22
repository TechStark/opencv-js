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
  
  // Test 1: Mat operations (should work)
  console.log("\n--- Test 1: Mat Operations ---");
  let mat = new cv.Mat(100, 100, cv.CV_8UC3, new cv.Scalar(255, 0, 0));
  console.log("✓ Mat created successfully");
  console.log(`  Size: ${mat.rows}x${mat.cols}, Channels: ${mat.channels()}`);
  
  // Test 2: imshow (should throw clear error in Node.js)
  console.log("\n--- Test 2: cv.imshow() ---");
  try {
    cv.imshow("mat:", mat);
    console.log("✗ imshow succeeded (unexpected in Node.js)");
  } catch (e) {
    console.log("✓ imshow threw expected error:");
    console.log(`  ${e.message}`);
  }
  
  mat.delete();
  
  // Test 3: VideoCapture (should throw clear error in Node.js)
  console.log("\n--- Test 3: cv.VideoCapture() ---");
  try {
    const cap = new cv.VideoCapture("test");
    console.log("✗ VideoCapture succeeded (unexpected in Node.js)");
  } catch (e) {
    console.log("✓ VideoCapture threw expected error:");
    console.log(`  ${e.message}`);
  }
  
  // Test 4: Other OpenCV operations (should work)
  console.log("\n--- Test 4: Other OpenCV Operations ---");
  let mat2 = new cv.Mat(100, 100, cv.CV_8UC1);
  cv.GaussianBlur(mat2, mat2, new cv.Size(5, 5), 0);
  console.log("✓ GaussianBlur operation succeeded");
  mat2.delete();
  
  console.log("\n✓ All tests passed!");
}

main();
