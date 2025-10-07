import type { double, int, Size } from "./_types";
/*
 * # Object Detection
 * ## Haar Feature-based Cascade Classifier for Object Detection
 *
 *
 * The object detector described below has been initially proposed by Paul Viola Viola01 and improved by Rainer Lienhart Lienhart02 .
 *
 * First, a classifier (namely a *cascade of boosted classifiers working with haar-like features*) is trained with a few hundred sample views of a particular object (i.e., a face or a car), called positive examples, that are scaled to the same size (say, 20x20), and negative examples - arbitrary images of the same size.
 *
 * After a classifier is trained, it can be applied to a region of interest (of the same size as used during the training) in an input image. The classifier outputs a "1" if the region is likely to show the object (i.e., face/car), and "0" otherwise. To search for the object in the whole image one can move the search window across the image and check every location using the classifier. The classifier is designed so that it can be easily "resized" in order to be able to find the objects of interest at different sizes, which is more efficient than resizing the image itself. So, to find an object of an unknown size in the image the scan procedure should be done several times at different scales.
 *
 * The word "cascade" in the classifier name means that the resultant classifier consists of several simpler classifiers (*stages*) that are applied subsequently to a region of interest until at some stage the candidate is rejected or all the stages are passed. The word "boosted" means that the classifiers at every stage of the cascade are complex themselves and they are built out of basic classifiers using one of four different boosting techniques (weighted voting). Currently Discrete Adaboost, Real Adaboost, Gentle Adaboost and Logitboost are supported. The basic classifiers are decision-tree classifiers with at least 2 leaves. Haar-like features are the input to the basic classifiers, and are calculated as described below. The current algorithm uses the following Haar-like features:
 *
 *
 *  The feature used in a particular classifier is specified by its shape (1a, 2b etc.), position within the region of interest and the scale (this scale is not the same as the scale used at the detection stage, though these two scales are multiplied). For example, in the case of the third line feature (2c) the response is calculated as the difference between the sum of image pixels under the rectangle covering the whole feature (including the two white stripes and the black stripe in the middle) and the sum of the image pixels under the black stripe multiplied by 3 in order to compensate for the differences in the size of areas. The sums of pixel values over a rectangular regions are calculated rapidly using integral images (see below and the integral description).
 *
 * To see the object detector at work, have a look at the facedetect demo:
 *
 * The following reference is for the detection part only. There is a separate application called opencv_traincascade that can train a cascade of boosted classifiers from a set of samples.
 *
 *
 *
 * In the new C++ interface it is also possible to use LBP (local binary pattern) features in addition to Haar-like features. .. [Viola01] Paul Viola and Michael J. Jones. Rapid Object Detection using a Boosted Cascade of Simple Features. IEEE CVPR, 2001. The paper is available online at
 */
export declare function createFaceDetectionMaskGenerator(): any;

/**
 * The function is a wrapper for the generic function partition . It clusters all the input rectangles
 * using the rectangle equivalence criteria that combines rectangles with similar sizes and similar
 * locations. The similarity is defined by eps. When eps=0 , no clustering is done at all. If
 * `$\\texttt{eps}\\rightarrow +\\inf$` , all the rectangles are put in one cluster. Then, the small
 * clusters containing less than or equal to groupThreshold rectangles are rejected. In each other
 * cluster, the average rectangle is computed and put into the output rectangle list.
 *
 * @param rectList Input/output vector of rectangles. Output vector includes retained and grouped
 * rectangles. (The Python list is not modified in place.)
 *
 * @param groupThreshold Minimum possible number of rectangles minus 1. The threshold is used in a
 * group of rectangles to retain it.
 *
 * @param eps Relative difference between sides of the rectangles to merge them into a group.
 */
export declare function groupRectangles(
  rectList: any,
  groupThreshold: int,
  eps?: double,
): void;

/**
 * This is an overloaded member function, provided for convenience. It differs from the above function
 * only in what argument(s) it accepts.
 */
export declare function groupRectangles(
  rectList: any,
  weights: any,
  groupThreshold: int,
  eps?: double,
): void;

/**
 * This is an overloaded member function, provided for convenience. It differs from the above function
 * only in what argument(s) it accepts.
 */
export declare function groupRectangles(
  rectList: any,
  groupThreshold: int,
  eps: double,
  weights: any,
  levelWeights: any,
): void;

/**
 * This is an overloaded member function, provided for convenience. It differs from the above function
 * only in what argument(s) it accepts.
 */
export declare function groupRectangles(
  rectList: any,
  rejectLevels: any,
  levelWeights: any,
  groupThreshold: int,
  eps?: double,
): void;

/**
 * This is an overloaded member function, provided for convenience. It differs from the above function
 * only in what argument(s) it accepts.
 */
export declare function groupRectangles_meanshift(
  rectList: any,
  foundWeights: any,
  foundScales: any,
  detectThreshold?: double,
  winDetSize?: Size,
): void;

export declare const CASCADE_DO_CANNY_PRUNING: any; // initializer: = 1

export declare const CASCADE_SCALE_IMAGE: any; // initializer: = 2

export declare const CASCADE_FIND_BIGGEST_OBJECT: any; // initializer: = 4

export declare const CASCADE_DO_ROUGH_SEARCH: any; // initializer: = 8

export { QRCodeDetector } from "./QRCodeDetector";
export {
  QRCodeDetectorAruco,
  QRCodeDetectorAruco_Params,
} from "./QRCodeDetectorAruco";

/**
 * QRCodeEncoder class for generating QR codes.
 * 
 * Note: This class is not currently available in the OpenCV.js build,
 * although the constants and enums are available. This is a type definition
 * for compatibility and future support.
 * 
 * @see https://github.com/TechStark/opencv-js/issues/58
 */
export declare class QRCodeEncoder {
  /**
   * Creates a new QRCodeEncoder instance.
   * @param parameters Optional parameters for QR code generation
   */
  constructor(parameters?: QRCodeEncoder_Params);

  /**
   * Encode text data into a QR code.
   * @param encoded_info The text data to encode
   * @param qrcode Output matrix containing the generated QR code
   */
  encode(encoded_info: string, qrcode: any): void;

  /**
   * Encode text data into a QR code with specified parameters.
   * @param encoded_info The text data to encode  
   * @param qrcode Output matrix containing the generated QR code
   * @param params Parameters for QR code generation
   */
  encodeStructuredAppend(encoded_info: string, qrcode: any, params: QRCodeEncoder_Params): void;
}

/**
 * Parameters for QRCodeEncoder.
 */
export declare class QRCodeEncoder_Params {
  constructor();
  
  /**
   * The version of the QR code (size). If 0, the optimal version is chosen.
   */
  version: int;
  
  /**
   * The error correction level.
   */
  correction_level: QRCodeEncoder_CorrectionLevel;
  
  /**
   * The encoding mode.
   */
  mode: QRCodeEncoder_EncodeMode;
  
  /**
   * The structure append index for structured append mode.
   */
  structure_number: int;
}

/**
 * QR Code error correction levels.
 */
export declare enum QRCodeEncoder_CorrectionLevel {
  CORRECT_LEVEL_L = 0,
  CORRECT_LEVEL_M = 1, 
  CORRECT_LEVEL_Q = 2,
  CORRECT_LEVEL_H = 3
}

/**
 * QR Code encoding modes.
 */
export declare enum QRCodeEncoder_EncodeMode {
  MODE_NUMERIC = 0,
  MODE_ALPHANUMERIC = 1,
  MODE_BYTE = 2,
  MODE_KANJI = 3,
  MODE_ECI = 4,
  MODE_STRUCTURED_APPEND = 5,
  MODE_AUTO = 6
}

/**
 * QR Code ECI encodings.
 */
export declare enum QRCodeEncoder_ECIEncodings {
  ECI_UTF8 = 26
}

// QRCodeEncoder constants (already available in runtime)
export declare const QRCodeEncoder_CORRECT_LEVEL_L: any;
export declare const QRCodeEncoder_CORRECT_LEVEL_M: any;
export declare const QRCodeEncoder_CORRECT_LEVEL_Q: any;
export declare const QRCodeEncoder_CORRECT_LEVEL_H: any;
export declare const QRCodeEncoder_MODE_NUMERIC: any;
export declare const QRCodeEncoder_MODE_ALPHANUMERIC: any;
export declare const QRCodeEncoder_MODE_BYTE: any;
export declare const QRCodeEncoder_MODE_KANJI: any;
export declare const QRCodeEncoder_MODE_ECI: any;
export declare const QRCodeEncoder_MODE_STRUCTURED_APPEND: any;
export declare const QRCodeEncoder_MODE_AUTO: any;
export declare const QRCodeEncoder_ECI_UTF8: any;
