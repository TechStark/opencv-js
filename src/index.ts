export * from "./types/opencv";
import { extendMatWithReshape } from "./mat-extensions";

// Extend Mat with missing methods when OpenCV is loaded
if (typeof global !== 'undefined' && global.cv) {
  extendMatWithReshape();
}
