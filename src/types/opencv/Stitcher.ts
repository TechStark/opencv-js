import type {
  bool,
  double,
  InputArray,
  InputArrayOfArrays,
  int,
  IntVector,
  Mat,
  OutputArray,
  Ptr,
  Rect,
  UMat,
} from "./_types";

/**
 * High level image stitcher.
 *
 * It's possible to use this class to create panoramas by stitching together multiple images.
 * The stitcher combines several algorithms in a configurable pipeline to perform the stitching.
 *
 * Source:
 * [opencv2/stitching.hpp](https://github.com/opencv/opencv/tree/master/modules/stitching/include/opencv2/stitching.hpp).
 *
 * @note
 * This class is part of the stitching module which may not be enabled in the OpenCV.js build.
 * Check the build configuration or rebuild OpenCV.js with the stitching module enabled to use this class.
 */
export declare class Stitcher {
  /**
   * Creates a Stitcher configured in one of the stitching modes.
   *
   * @param mode Scenario for stitcher operation. This is usually used to determine how to
   * set each of the stitcher properties to optimum values.
   * Stitcher.PANORAMA mode expects images under horizontal perspective.
   * Stitcher.SCANS mode is designed for scanned images.
   *
   * @returns An instance of Stitcher class.
   */
  public static create(mode?: int): Stitcher;

  /**
   * @returns Registration resolution in megapixels
   */
  public registrationResol(): double;

  /**
   * Sets the registration resolution.
   *
   * @param resol_mpx Resolution for image registration in megapixels.
   * -1 for original resolution.
   */
  public setRegistrationResol(resol_mpx: double): void;

  /**
   * @returns Seam estimation resolution in megapixels
   */
  public seamEstimationResol(): double;

  /**
   * Sets the seam estimation resolution.
   *
   * @param resol_mpx Resolution for seam estimation in megapixels.
   * -1 for original resolution.
   */
  public setSeamEstimationResol(resol_mpx: double): void;

  /**
   * @returns Compositing resolution in megapixels
   */
  public compositingResol(): double;

  /**
   * Sets the compositing resolution.
   *
   * @param resol_mpx Resolution for compositing in megapixels.
   * -1 for original resolution.
   */
  public setCompositingResol(resol_mpx: double): void;

  /**
   * @returns Panorama confidence threshold
   */
  public panoConfidenceThresh(): double;

  /**
   * Sets the panorama confidence threshold.
   *
   * @param conf_thresh Threshold for the panorama confidence.
   * The stitch() method returns ERR_NEED_MORE_IMGS if the confidence is below this threshold.
   */
  public setPanoConfidenceThresh(conf_thresh: double): void;

  /**
   * @returns Wave correction flag
   */
  public waveCorrection(): bool;

  /**
   * Sets wave correction on or off.
   *
   * @param flag true to enable wave correction, false to disable.
   */
  public setWaveCorrection(flag: bool): void;

  /**
   * @returns Interpolation method used for all resizing operations.
   */
  public interpolationFlags(): int;

  /**
   * Sets the interpolation method for all resizing operations.
   *
   * @param interp_flags Interpolation method.
   */
  public setInterpolationFlags(interp_flags: int): void;

  /**
   * @returns Wave correction kind
   */
  public waveCorrectKind(): int;

  /**
   * Sets the kind of wave correction.
   *
   * @param kind Wave correction kind (horizontal or vertical).
   */
  public setWaveCorrectKind(kind: int): void;

  /**
   * Estimates the transformation matrices for each input image.
   *
   * @param images Input images.
   * @param masks Optional masks for each input image.
   *
   * @returns Status code.
   */
  public estimateTransform(images: InputArrayOfArrays): int;
  public estimateTransform(
    images: InputArrayOfArrays,
    masks: InputArrayOfArrays,
  ): int;

  /**
   * Tries to stitch the given images.
   *
   * @param images Input images.
   * @param pano Final panorama (stitched image).
   *
   * @returns Status code.
   */
  public stitch(images: InputArrayOfArrays, pano: OutputArray): int;

  /**
   * Tries to stitch the given images with optional masks.
   *
   * @param images Input images.
   * @param masks Masks for each input image specifying where to look for keypoints (optional).
   * @param pano Final panorama (stitched image).
   *
   * @returns Status code.
   */
  public stitch(
    images: InputArrayOfArrays,
    masks: InputArrayOfArrays,
    pano: OutputArray,
  ): int;

  /**
   * Tries to compose the given images (or images stored internally from the other function
   * calls) into the final pano under the assumption that the image transformations
   * were estimated before.
   *
   * @param pano Final panorama (stitched image).
   *
   * @returns Status code.
   */
  public composePanorama(pano: OutputArray): int;

  /**
   * Tries to compose the given images into the final panorama.
   *
   * @param images Input images.
   * @param pano Final panorama (stitched image).
   *
   * @returns Status code.
   */
  public composePanorama(images: InputArrayOfArrays, pano: OutputArray): int;

  /**
   * Gets the connected components of the stitched images.
   *
   * @returns Array containing the indices of images in each connected component.
   * Images that could not be stitched together will be in separate components.
   */
  public component(): IntVector;

  /**
   * @returns Indices (0-based) of ROI for each image.
   */
  public workScale(): double;

  /**
   * Releases the object.
   */
  public delete(): void;
}

/**
 * Status codes returned by the stitching pipeline.
 */
export type StitcherStatus = int;

/**
 * Stitching completed successfully.
 */
export declare const Stitcher_OK: StitcherStatus; // initializer: = 0

/**
 * Error: not enough input images provided for stitching.
 */
export declare const Stitcher_ERR_NEED_MORE_IMGS: StitcherStatus; // initializer: = 1

/**
 * Error: homography estimation failed.
 */
export declare const Stitcher_ERR_HOMOGRAPHY_EST_FAIL: StitcherStatus; // initializer: = 2

/**
 * Error: camera parameters adjustment failed.
 */
export declare const Stitcher_ERR_CAMERA_PARAMS_ADJUST_FAIL: StitcherStatus; // initializer: = 3

/**
 * Stitcher operating modes.
 */
export type StitcherMode = int;

/**
 * Mode for creating photo panoramas. Expects images under perspective transformation and
 * projects resulting panorama to sphere.
 */
export declare const Stitcher_PANORAMA: StitcherMode; // initializer: = 0

/**
 * Mode for stitching scanned images. Images are expected to be similar and under affine transformation.
 */
export declare const Stitcher_SCANS: StitcherMode; // initializer: = 1

/**
 * Wave correction kinds.
 */
export type WaveCorrectKind = int;

/**
 * Horizontal wave correction.
 */
export declare const WAVE_CORRECT_HORIZ: WaveCorrectKind; // initializer: = 0

/**
 * Vertical wave correction.
 */
export declare const WAVE_CORRECT_VERT: WaveCorrectKind; // initializer: = 1
