import type {
  Algorithm,
  bool,
  InputArray,
  InputOutputArray,
  Mat,
  MatVector,
  OutputArray,
  Point2f,
  Ptr,
  Rect,
  RectVector,
} from "./_types";

/**
 * # Face Analysis
 * ## Face landmark detection
 *
 * Facemark is a base class for all face landmark detection algorithms.
 * It provides a unified interface for training and fitting face landmarks.
 */

/**
 * Abstract base class for all facemark models
 *
 * To use the Facemark API:
 * 1. Create an instance using createFacemarkLBF() or other factory functions
 * 2. Load a pre-trained model using loadModel()
 * 3. Detect faces using a face detector (e.g., CascadeClassifier)
 * 4. Fit the facemark model to detected faces using fit()
 *
 * All facemark models in OpenCV are supported using this unified API.
 */
export declare class Facemark extends Algorithm {
  /**
   * Loads a trained facemark model from file.
   *
   * @param model Path to the trained model file
   */
  public loadModel(model: string): void;

  /**
   * Detects facial landmarks on a face image.
   *
   * @param image Input image (grayscale or color)
   * @param faces Vector of face rectangles (RectVector) detected by a face detector
   * @param landmarks Output vector of matrices (MatVector) where each Mat contains 2D points (Point2f)
   *                  representing facial landmarks for each detected face
   * @returns true if landmarks were successfully detected, false otherwise
   *
   * @example
   * ```typescript
   * const faces = new cv.RectVector();
   * const landmarks = new cv.MatVector();
   * const success = facemark.fit(gray, faces, landmarks);
   * if (success) {
   *   for (let i = 0; i < landmarks.size(); i++) {
   *     const points = landmarks.get(i); // Mat with Point2f data
   *     // points.rows = number of landmarks (e.g., 68 for LBF model)
   *     // points.cols = 2 (x, y coordinates)
   *   }
   * }
   * ```
   */
  public fit(image: InputArray, faces: RectVector, landmarks: MatVector): bool;
}

/**
 * FacemarkLBF - Local Binary Features based face landmark detector
 *
 * This is an implementation of the LBF (Local Binary Features) algorithm for
 * facial landmark detection. It is fast and works well for real-time applications.
 *
 * Reference:
 * Ren, S., Cao, X., Wei, Y., & Sun, J. (2014).
 * Face alignment at 3000 fps via regressing local binary features.
 * In Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (pp. 1685-1692).
 */
export declare class FacemarkLBF extends Facemark {
  /**
   * Construct FacemarkLBF instance
   */
  public constructor();
}

/**
 * Parameters for FacemarkLBF training and detection
 */
export declare class FacemarkLBF_Params {
  /**
   * Shape offset multiplier for data augmentation
   */
  public shape_offset: number;

  /**
   * Number of cascades (stages) in the regression
   */
  public cascade_depth: number;

  /**
   * Number of trees per cascade
   */
  public tree_depth: number;

  /**
   * Depth of each tree
   */
  public num_trees_per_cascade_level: number;

  /**
   * Learning rate
   */
  public learning_rate: number;

  /**
   * Oversampling amount for training
   */
  public oversampling_amount: number;

  /**
   * Number of test coordinates for each tree node
   */
  public num_test_coordinates: number;

  /**
   * Lambda parameter for regularization
   */
  public lambda: number;

  /**
   * Number of test splits for each tree node
   */
  public num_test_splits: number;

  /**
   * Face detection configuration file (cascade classifier)
   */
  public cascade_face: string;

  /**
   * File containing facial feature points for training
   */
  public model_filename: string;

  /**
   * Flag for saving trained model
   */
  public save_model: bool;

  /**
   * Random seed for reproducibility
   */
  public seed: number;

  /**
   * Feature extraction radius
   */
  public feats: InputArray;

  /**
   * Pupil distance (for alignment)
   */
  public pupils: InputArray;

  /**
   * Create default parameters
   */
  public constructor();
}

/**
 * Face module namespace containing all face analysis functionality
 */
export declare namespace face {
  /**
   * Creates an instance of the FacemarkLBF algorithm.
   *
   * @param parameters Optional parameters for FacemarkLBF configuration
   * @returns Pointer to the FacemarkLBF instance
   *
   * @example
   * ```typescript
   * // Create facemark instance
   * const facemark = cv.face.createFacemarkLBF();
   *
   * // Load pre-trained model
   * facemark.loadModel('lbfmodel.yaml');
   *
   * // Detect faces first (using CascadeClassifier)
   * const faceCascade = new cv.CascadeClassifier();
   * faceCascade.load('haarcascade_frontalface_default.xml');
   * const faces = new cv.RectVector();
   * faceCascade.detectMultiScale(gray, faces);
   *
   * // Fit landmarks
   * const landmarks = new cv.MatVector();
   * const success = facemark.fit(gray, faces, landmarks);
   *
   * if (success) {
   *   // Use landmarks
   *   for (let i = 0; i < landmarks.size(); i++) {
   *     const points = landmarks.get(i);
   *     // Process points...
   *   }
   * }
   *
   * // Clean up
   * landmarks.delete();
   * faces.delete();
   * facemark.delete();
   * faceCascade.delete();
   * ```
   */
  export function createFacemarkLBF(
    parameters?: FacemarkLBF_Params,
  ): FacemarkLBF;

  /**
   * FacemarkLBF class
   */
  export { FacemarkLBF };

  /**
   * FacemarkLBF parameters class
   */
  export { FacemarkLBF_Params };

  /**
   * Base Facemark class
   */
  export { Facemark };
}
