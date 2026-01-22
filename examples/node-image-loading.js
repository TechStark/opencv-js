// This example demonstrates the CORRECT way to load images in Node.js
// cv.imread() does NOT work in Node.js - it requires browser DOM APIs

const { Jimp } = require("jimp");
const cvModule = require("../dist/opencv.js");

async function main() {
  console.log("Loading OpenCV.js...");
  
  // Initialize OpenCV
  let cv;
  if (cvModule instanceof Promise) {
    cv = await cvModule;
  } else {
    await new Promise((resolve) => {
      cvModule.onRuntimeInitialized = () => {
        resolve();
      };
    });
    cv = cvModule;
  }
  
  console.log("OpenCV.js is ready!");
  console.log(cv.getBuildInformation().split('\n').slice(0, 3).join('\n'));

  console.log("\n=== INCORRECT approach (will fail) ===");
  try {
    // This will throw: "document is not defined"
    const img = cv.imread("Lenna.png");
    console.log("imread succeeded (unexpected!)");
  } catch (err) {
    console.log(`❌ cv.imread() failed as expected: ${err.message || err}`);
  }

  console.log("\n=== CORRECT approach for Node.js ===");
  try {
    // Load image using jimp (supports jpg, png, bmp, tiff, gif)
    const jimpImage = await Jimp.read("test/Lenna.png");
    console.log("✓ Loaded image with Jimp");
    
    // Convert to OpenCV Mat
    const img = cv.matFromImageData(jimpImage.bitmap);
    console.log(`✓ Created Mat: ${img.rows}x${img.cols}, channels: ${img.channels()}`);
    
    // Process the image
    const gray = new cv.Mat();
    cv.cvtColor(img, gray, cv.COLOR_RGBA2GRAY);
    console.log(`✓ Converted to grayscale: ${gray.rows}x${gray.cols}, channels: ${gray.channels()}`);
    
    const blurred = new cv.Mat();
    cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0, 0, cv.BORDER_DEFAULT);
    console.log(`✓ Applied Gaussian blur`);
    
    // Always cleanup Mat objects to prevent memory leaks
    img.delete();
    gray.delete();
    blurred.delete();
    console.log("✓ Cleaned up Mat objects");
    
    console.log("\n✅ Success! Image processing completed.");
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
