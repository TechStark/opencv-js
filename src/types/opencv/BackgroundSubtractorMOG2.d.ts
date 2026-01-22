import type { BackgroundSubtractor, bool, double, int } from "./_types";

/**
 * Gaussian Mixture-based Background/Foreground Segmentation Algorithm.
 *
 * The class implements the Gaussian mixture model background subtraction described in [Zivkovic2004] 
 * and [Zivkovic2006].
 *
 * Source:
 * [opencv2/video.hpp](https://github.com/opencv/opencv/tree/master/modules/video/include/opencv2/video/background_segm.hpp).
 */
export declare class BackgroundSubtractorMOG2 extends BackgroundSubtractor {
  /**
   * @param history Length of the history.
   * @param varThreshold Threshold on the squared Mahalanobis distance between the pixel and the model 
   * to decide whether a pixel is well described by the background model. This parameter does not 
   * affect the background update.
   * @param detectShadows If true, the algorithm will detect shadows and mark them. It decreases the 
   * speed a bit, so if you do not need this feature, set the parameter to false.
   */
  public constructor(history?: int, varThreshold?: double, detectShadows?: bool);
}