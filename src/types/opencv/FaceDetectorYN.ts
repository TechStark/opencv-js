import type { double, int, InputArray, OutputArray, Size } from "./_types";

/**
 * DNN-based face detector using YuNet model.
 *
 * Replaces the removed CascadeClassifier in OpenCV 5.x.
 * Constructor accepts 3–8 parameters; the first three are required.
 *
 * Output Mat from `detect()` has shape [N, 15]:
 *   [x, y, w, h, re_x, re_y, le_x, le_y, nose_x, nose_y, mr_x, mr_y, ml_x, ml_y, score]
 *
 * Source:
 * [opencv2/objdetect.hpp](https://github.com/opencv/opencv/tree/master/modules/objdetect/include/opencv2/objdetect.hpp)
 */
export declare class FaceDetectorYN {
  /**
   * @param model Path to the ONNX model file (e.g. face_detection_yunet_2023mar.onnx)
   * @param config Path to config file, use "" for ONNX models
   * @param inputSize Size of the input image {width, height}
   * @param scoreThreshold Score threshold for face detection (default 0.9)
   * @param nmsThreshold NMS IoU threshold (default 0.3)
   * @param topK Keep top-K detections before NMS (default 5000)
   * @param backendId DNN backend (default DNN_BACKEND_DEFAULT)
   * @param targetId DNN target (default DNN_TARGET_CPU)
   */
  constructor(
    model: string,
    config: string,
    inputSize: Size,
    scoreThreshold?: double,
    nmsThreshold?: double,
    topK?: int,
    backendId?: int,
    targetId?: int,
  );

  /**
   * Detect faces in the input image.
   * @param image Input BGR image
   * @param faces Output Mat of shape [N, 15]
   * @returns Number of detected faces
   */
  public detect(image: InputArray, faces: OutputArray): int;

  /** Set the input size (must match actual image size before calling detect) */
  public setInputSize(inputSize: Size): void;

  /** Set the score threshold */
  public setScoreThreshold(scoreThreshold: double): void;

  /** Set the NMS threshold */
  public setNMSThreshold(nmsThreshold: double): void;

  /** Set the top-K value */
  public setTopK(topK: int): void;

  /** Get the current input size */
  public getInputSize(): Size;

  /** Get the current score threshold */
  public getScoreThreshold(): double;

  /** Get the current NMS threshold */
  public getNMSThreshold(): double;

  /** Get the current top-K value */
  public getTopK(): int;

  /** Release WASM memory */
  public delete(): void;
}
