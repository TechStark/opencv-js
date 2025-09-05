/**
 * Example demonstrating how to use applyColorMap with COLORMAP_JET
 * This replicates the functionality of cv2.applyColorMap(img, COLORMAP_JET) from Python OpenCV
 */

import cvReadyPromise from "./src";

async function applyColorMapExample() {
  const cv = await cvReadyPromise;
  
  // Create a grayscale image (equivalent to a grayscale input in Python)
  const src = new cv.Mat(200, 200, cv.CV_8UC1);
  
  // Fill with a gradient pattern for demonstration
  for (let i = 0; i < 200; i++) {
    for (let j = 0; j < 200; j++) {
      // Create a circular gradient pattern
      const centerX = 100;
      const centerY = 100;
      const distance = Math.sqrt((i - centerX) ** 2 + (j - centerY) ** 2);
      const value = Math.min(255, Math.max(0, 255 - distance * 2));
      src.ucharPtr(i, j)[0] = value;
    }
  }
  
  // Create output Mat for the colored result
  const dst = new cv.Mat();
  
  // Apply JET colormap - this is equivalent to cv2.applyColorMap(img, cv2.COLORMAP_JET)
  cv.applyColorMap(src, dst, cv.COLORMAP_JET);
  
  console.log("Successfully applied COLORMAP_JET!");
  console.log(`Input image: ${src.rows}x${src.cols}, ${src.channels()} channel(s)`);
  console.log(`Output image: ${dst.rows}x${dst.cols}, ${dst.channels()} channel(s)`);
  
  // Clean up memory
  src.delete();
  dst.delete();
}

// Demonstrate other available colormaps
async function demonstrateOtherColormaps() {
  const cv = await cvReadyPromise;
  
  const src = new cv.Mat(100, 100, cv.CV_8UC1, new cv.Scalar(128)); // Gray image
  const dst = new cv.Mat();
  
  const colormaps = [
    { name: "JET", value: cv.COLORMAP_JET },
    { name: "VIRIDIS", value: cv.COLORMAP_VIRIDIS },
    { name: "PLASMA", value: cv.COLORMAP_PLASMA },
    { name: "MAGMA", value: cv.COLORMAP_MAGMA },
    { name: "TURBO", value: cv.COLORMAP_TURBO },
  ];
  
  console.log("\nAvailable colormaps:");
  colormaps.forEach(({ name, value }) => {
    cv.applyColorMap(src, dst, value);
    console.log(`✓ ${name} colormap applied successfully`);
  });
  
  // Clean up
  src.delete();
  dst.delete();
}

// Run the examples
if (require.main === module) {
  applyColorMapExample()
    .then(() => demonstrateOtherColormaps())
    .then(() => console.log("\nAll examples completed successfully!"))
    .catch(console.error);
}

export { applyColorMapExample, demonstrateOtherColormaps };