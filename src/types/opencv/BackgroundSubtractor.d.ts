import type { Algorithm, bool, double, InputArray, OutputArray } from "./_types";

/**
 * Base class for background/foreground segmentation algorithms.
 *
 * The class is only used to define the common interface for the whole family of background/foreground 
 * segmentation algorithms.
 *
 * Source:
 * [opencv2/video.hpp](https://github.com/opencv/opencv/tree/master/modules/video/include/opencv2/video/background_segm.hpp).
 */
export declare class BackgroundSubtractor extends Algorithm {
  public constructor();

  /**
   * Computes a foreground mask.
   *
   * @param image Next video frame.
   * @param fgmask The output foreground mask as an 8-bit binary image.
   * @param learningRate The value between 0 and 1 that indicates how fast the background model is learnt. 
   * Negative parameter value makes the algorithm use some automatically chosen learning rate.
   * 0 means that the background model is not updated at all, 1 means that the background model is 
   * completely reinitialized from the last frame.
   */
  public apply(image: InputArray, fgmask: OutputArray, learningRate?: double): void;

  /**
   * Computes a background image.
   *
   * @param backgroundImage The output background image.
   *
   * @note Sometimes the background image can be very blurry, as it contain the average background 
   * statistics.
   */
  public getBackgroundImage(backgroundImage: OutputArray): void;
}