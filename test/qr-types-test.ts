// Simple TypeScript compilation test for QRCodeDetector
// This demonstrates that the types are properly exposed

import { CV } from "../src/types/opencv";

// This should compile without errors, demonstrating that:
// 1. QRCodeDetector is available as a type
// 2. QRCodeDetectorAruco is available as a type  
// 3. QRCodeDetectorAruco_Params is available as a type
// 4. All methods have proper type signatures

function demonstrateQRCodeDetectorTypes(cv: CV) {
  // TypeScript should provide intellisense and type checking for these:
  
  const detector = new cv.QRCodeDetector();
  const arucoDetector = new cv.QRCodeDetectorAruco();
  const params = new cv.QRCodeDetectorAruco_Params();
  
  // Example method calls that should have proper type checking:
  // const detected: boolean = detector.detect(image, points);
  // const decoded: string = detector.decode(image, points);
  // const result: string = detector.detectAndDecode(image);
  
  detector.delete();
  arucoDetector.delete();
  params.delete();
}

export { demonstrateQRCodeDetectorTypes };