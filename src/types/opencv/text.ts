import type {
  bool,
  InputArray,
  Mat,
  OutputArray,
  Rect,
  RectVector,
} from "./_types";

/**
 * # Text Detection and Recognition Module
 *
 * This module provides algorithms for text detection and recognition in natural scene images.
 * It includes the Stroke Width Transform (SWT) algorithm and other text processing functions.
 */

/**
 * Applies the Stroke Width Transform operator followed by filtering of connected components
 * of similar Stroke Widths to return letter candidates. It also chains them by proximity
 * and size, saving the result in chainBBs.
 *
 * The SWT algorithm is particularly useful for detecting text in natural scene images by
 * analyzing stroke widths to identify potential text regions.
 *
 * @param input - The input image with 3 channels (RGB or BGR).
 * @param result - A vector of resulting bounding boxes (Rect) where probability of finding text is high.
 * @param dark_on_light - A boolean value signifying whether the text is darker or lighter than
 *                        the background. This reverses the gradient obtained from Scharr operator
 *                        and significantly affects the result.
 * @param draw - An optional Mat of type CV_8UC3 which visualizes the detected letters using bounding boxes.
 * @param chainBBs - An optional parameter which chains the letter candidates according to heuristics
 *                   in the algorithm and returns all possible regions where text is likely to occur.
 *
 * @example
 * ```typescript
 * const img = cv.imread('imageId');
 * const results = new cv.RectVector();
 * const draw = new cv.Mat();
 * const chainBBs = new cv.Mat();
 *
 * // Detect dark text on light background
 * cv.detectTextSWT(img, results, true, draw, chainBBs);
 *
 * console.log(`Found ${results.size()} text regions`);
 *
 * // Clean up
 * results.delete();
 * draw.delete();
 * chainBBs.delete();
 * img.delete();
 * ```
 *
 * @see https://docs.opencv.org/4.x/d8/de7/namespacecv_1_1text.html#a9370f4e7849c94fb418eebd915a6839d
 */
export declare function detectTextSWT(
  input: InputArray,
  result: RectVector,
  dark_on_light: bool,
  draw?: OutputArray,
  chainBBs?: OutputArray,
): void;
