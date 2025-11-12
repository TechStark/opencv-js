// Example: Using cv.ximgproc.thinning() with opencv-js contrib modules
//
// This example demonstrates how to use the thinning function from opencv_contrib
// Note: Requires OpenCV.js built with contrib modules

import { checkContribAvailability, getContribHelpMessage } from '../src/contrib-utils';

// In browser environment or after proper opencv.js loading
async function demonstrateThinning() {
  // First, check if contrib modules are available
  const availability = checkContribAvailability();
  
  if (!availability.hasXimgproc) {
    console.error(getContribHelpMessage());
    return;
  }

  console.log('✅ OpenCV contrib modules available!');

  // Create a sample binary image for thinning
  const rows = 200;
  const cols = 200;
  const src = new cv.Mat(rows, cols, cv.CV_8UC1, new cv.Scalar(0));

  // Draw some shapes to create a binary image
  // Draw a rectangle
  cv.rectangle(src, new cv.Point(50, 50), new cv.Point(150, 150), new cv.Scalar(255), -1);
  
  // Draw some lines to create interesting structure for thinning
  cv.line(src, new cv.Point(75, 25), new cv.Point(75, 175), new cv.Scalar(255), 10);
  cv.line(src, new cv.Point(125, 25), new cv.Point(125, 175), new cv.Scalar(255), 10);

  // Create destination matrix for thinning result
  const dst = new cv.Mat();

  try {
    // Apply thinning using Zhang-Suen algorithm
    cv.ximgproc.thinning(src, dst, cv.ximgproc.THINNING_ZHANGSUEN);
    
    console.log('✅ Thinning (Zhang-Suen) completed successfully');
    console.log(`Output image size: ${dst.rows}x${dst.cols}`);

    // You can also use Guo-Hall algorithm
    const dst2 = new cv.Mat();
    cv.ximgproc.thinning(src, dst2, cv.ximgproc.THINNING_GUOHALL);
    
    console.log('✅ Thinning (Guo-Hall) completed successfully');
    
    // Clean up
    dst2.delete();
  } catch (error) {
    console.error('❌ Error during thinning:', error);
  } finally {
    // Always clean up matrices
    src.delete();
    dst.delete();
  }
}

// Example of checking availability without running thinning
function checkContribStatus() {
  const availability = checkContribAvailability();
  
  console.log('=== OpenCV Contrib Status ===');
  console.log('Has contrib modules:', availability.hasContrib);
  console.log('Has ximgproc module:', availability.hasXimgproc);
  console.log('Missing modules:', availability.missingModules);
  
  if (availability.buildInfo) {
    console.log('\n=== Build Information ===');
    console.log(availability.buildInfo);
  }
}

// Export for use in other files
export { demonstrateThinning, checkContribStatus };

// If running directly (e.g., in node.js for testing)
if (typeof window === 'undefined' && typeof process !== 'undefined') {
  console.log('🔍 Checking OpenCV contrib availability...');
  checkContribStatus();
  
  if (typeof cv !== 'undefined') {
    demonstrateThinning();
  } else {
    console.log('ℹ️  OpenCV not loaded. This example requires OpenCV.js to be loaded first.');
  }
}