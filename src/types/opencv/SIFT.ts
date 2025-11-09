import type { Feature2D, float, int } from "./_types";

/**
 * Class for extracting keypoints and computing descriptors using the Scale Invariant Feature Transform (SIFT) algorithm.
 * https://docs.opencv.org/4.12.0/d7/d60/classcv_1_1SIFT.html
 *
 * Note: SIFT is a patented algorithm that was made free in 2020 when the patent expired.
 * To use SIFT, you need to build OpenCV with OPENCV_ENABLE_NONFREE=ON.
 */
export declare class SIFT extends Feature2D {
  /**
   * Creates a new SIFT feature detector and descriptor extractor.
   * @param nfeatures The number of best features to retain. The features are ranked by their scores (measured in SIFT algorithm as the local contrast)
   * @param nOctaveLayers The number of layers in each octave. 3 is the value used in D. Lowe paper. The number of octaves is computed automatically from the image resolution.
   * @param contrastThreshold The contrast threshold used to filter out weak features in semi-uniform (low-contrast) regions. The larger the threshold, the less features are produced by the detector.
   * @param edgeThreshold The threshold used to filter out edge-like features. Note that the its meaning is different from the contrastThreshold, i.e. the larger the edgeThreshold, the less features are filtered out (more features are retained).
   * @param sigma The sigma of the Gaussian applied to the input image at the octave #0. If your image is captured with a weak camera with soft lenses, you might want to reduce the number.
   */
  public constructor(
    nfeatures?: int,
    nOctaveLayers?: int,
    contrastThreshold?: float,
    edgeThreshold?: float,
    sigma?: float,
  );

  /**
   * Returns the descriptor size in floats (128)
   */
  public getDefaultName(): string;
}
