/**
 * Example TypeScript code demonstrating type definitions for cv.face.createFacemarkLBF.
 * 
 * NOTE: This code will compile with TypeScript but will NOT run with the default opencv.js
 * because the face module is not included in the default build.
 * 
 * To run this code, you need to build opencv.js from source with opencv_contrib modules.
 * See doc/FACE_MODULE.md for instructions.
 */

import * as cv from "../src/types/opencv";

async function exampleFacialLandmarkDetection() {
  // This example shows TypeScript type checking for face module
  // The types are available, but runtime will fail unless using custom opencv.js build

  // Create facemark instance with default parameters
  const facemark = cv.face.createFacemarkLBF();

  // Or create with custom parameters
  const params = new cv.face.FacemarkLBF_Params();
  params.cascade_depth = 10;
  params.tree_depth = 5;
  params.num_trees_per_cascade_level = 500;
  const facemarkCustom = cv.face.createFacemarkLBF(params);

  // Load pre-trained model
  facemark.loadModel("lbfmodel.yaml");

  // Create face detector
  const faceCascade = new cv.CascadeClassifier();
  faceCascade.load("haarcascade_frontalface_default.xml");

  // Assume we have an image (this is pseudocode)
  const image = new cv.Mat();
  const gray = new cv.Mat();
  cv.cvtColor(image, gray, cv.COLOR_RGBA2GRAY);

  // Detect faces
  const faces = new cv.RectVector();
  faceCascade.detectMultiScale(gray, faces);

  // Fit landmarks
  const landmarks = new cv.MatVector();
  const success: boolean = facemark.fit(gray, faces, landmarks);

  if (success) {
    console.log(`Detected landmarks for ${landmarks.size()} faces`);

    // Process each face's landmarks
    for (let i = 0; i < landmarks.size(); i++) {
      const points = landmarks.get(i);
      console.log(`Face ${i}: ${points.rows} landmark points`);

      // Draw landmarks (68 points for LBF model)
      for (let j = 0; j < points.rows; j++) {
        const x = points.floatAt(j, 0);
        const y = points.floatAt(j, 1);
        cv.circle(image, new cv.Point(x, y), 2, new cv.Scalar(0, 255, 0), -1);
      }
    }
  }

  // Clean up
  landmarks.delete();
  faces.delete();
  gray.delete();
  image.delete();
  faceCascade.delete();
  facemark.delete();
  facemarkCustom.delete();
}

// TypeScript type checking will pass for this file
// Runtime execution requires custom opencv.js build with face module
export { exampleFacialLandmarkDetection };
