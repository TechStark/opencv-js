import { InputArray, OutputArray, int } from './_types';

/**
 * Extended Image Processing (ximgproc) module
 * 
 * This module contains implementations of modern algorithms for image processing tasks.
 * Note: This module requires opencv_contrib to be compiled with OpenCV.js
 */

// Thinning types enum
export const enum ThinningTypes {
  /** Thinning technique of Zhang-Suen */
  THINNING_ZHANGSUEN = 0,
  /** Thinning technique of Guo-Hall */
  THINNING_GUOHALL = 1
}

// Constants for thinning types
export declare const THINNING_ZHANGSUEN: ThinningTypes;
export declare const THINNING_GUOHALL: ThinningTypes;

// ximgproc module namespace - functions are accessed as cv.ximgproc.functionName
export declare const ximgproc: {
  /**
   * Applies a binary blob thinning operation, to achieve a skeletization of the input image.
   * 
   * The function transforms a binary blob image into a skeletized form using the technique of Zhang-Suen.
   * 
   * @param src Source 8-bit single-channel image, containing binary blobs, with blobs having 255 pixel values.
   * @param dst Destination image of the same size and the same type as src. The function can work in-place.
   * @param thinningType Value that defines which thinning algorithm should be used. See ThinningTypes
   */
  thinning(src: InputArray, dst: OutputArray, thinningType?: int): void;
  
  // Constants accessible within the module
  THINNING_ZHANGSUEN: ThinningTypes.THINNING_ZHANGSUEN;
  THINNING_GUOHALL: ThinningTypes.THINNING_GUOHALL;
};