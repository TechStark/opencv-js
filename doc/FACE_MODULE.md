# Face Module Support - createFacemarkLBF

## Overview

The `face` module in OpenCV provides facial landmark detection capabilities, including the `createFacemarkLBF` function. This document explains how to use these features with opencv-js.

## Important: Face Module Availability

**The default opencv.js binary does NOT include the face module.** The face module is part of the opencv_contrib repository and requires a custom build.

### Current opencv.js Build Includes:
- calib3d
- core
- dnn
- features2d
- flann
- imgproc
- js
- objdetect
- photo
- video

### NOT Included (requires custom build):
- **face** (contains createFacemarkLBF)
- and other opencv_contrib modules

## TypeScript Support

This package provides TypeScript type definitions for the face module, even though it's not included in the default opencv.js binary. These type definitions are available for users who build custom opencv.js with the face module enabled.

## Using createFacemarkLBF

### Option 1: Build Custom opencv.js (Recommended)

To use `cv.face.createFacemarkLBF`, you need to build opencv.js from source with opencv_contrib modules:

1. **Clone OpenCV and OpenCV Contrib repositories:**
   ```bash
   git clone https://github.com/opencv/opencv.git
   git clone https://github.com/opencv/opencv_contrib.git
   ```

2. **Install Emscripten SDK:**
   ```bash
   git clone https://github.com/emscripten-core/emsdk.git
   cd emsdk
   ./emsdk install latest
   ./emsdk activate latest
   source ./emsdk_env.sh
   ```

3. **Build opencv.js with face module:**
   ```bash
   cd opencv
   python ./platforms/js/build_js.py build_js \
     --cmake_option="-DOPENCV_EXTRA_MODULES_PATH=../opencv_contrib/modules" \
     --build_wasm
   ```

4. **Replace the opencv.js in your project** with the newly built one from `build_js/bin/opencv.js`

### Option 2: Use Alternative Face Detection Methods

If you don't need facial landmark detection specifically, consider using the built-in face detection methods:

- **FaceDetectorYN** - Available in the default opencv.js build
- **CascadeClassifier** - Haar cascade face detection (available)

Example using CascadeClassifier:
```typescript
import cv from "@techstark/opencv-js";

// Load face cascade classifier
const faceCascade = new cv.CascadeClassifier();
faceCascade.load('haarcascade_frontalface_default.xml');

// Detect faces
const gray = new cv.Mat();
cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

const faces = new cv.RectVector();
faceCascade.detectMultiScale(gray, faces);

console.log(`Detected ${faces.size()} faces`);

// Clean up
faces.delete();
gray.delete();
faceCascade.delete();
```

## Example Usage (with custom build)

Once you have opencv.js built with the face module, you can use it like this:

```typescript
import cv from "@techstark/opencv-js";

async function detectFacialLandmarks() {
  // Create facemark instance
  const facemark = cv.face.createFacemarkLBF();
  
  // Load pre-trained model
  // Download from: https://github.com/kurnianggoro/GSOC2017/tree/master/data
  facemark.loadModel('lbfmodel.yaml');
  
  // First, detect faces using a face detector
  const faceCascade = new cv.CascadeClassifier();
  faceCascade.load('haarcascade_frontalface_default.xml');
  
  // Convert image to grayscale
  const gray = new cv.Mat();
  cv.cvtColor(image, gray, cv.COLOR_RGBA2GRAY);
  
  // Detect faces
  const faces = new cv.RectVector();
  faceCascade.detectMultiScale(gray, faces);
  
  // Detect landmarks for each face
  const landmarks = new cv.MatVector();
  const success = facemark.fit(gray, faces, landmarks);
  
  if (success) {
    // Process landmarks
    for (let i = 0; i < landmarks.size(); i++) {
      const points = landmarks.get(i);
      // Each face has 68 landmark points (for LBF model)
      console.log(`Face ${i} has ${points.rows} landmarks`);
      
      // Draw landmarks on image
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
  faceCascade.delete();
  facemark.delete();
}
```

## FacemarkLBF Parameters

You can customize the FacemarkLBF algorithm with parameters:

```typescript
const params = new cv.face.FacemarkLBF_Params();
params.cascade_depth = 10;
params.tree_depth = 5;
params.num_trees_per_cascade_level = 500;
params.learning_rate = 0.1;

const facemark = cv.face.createFacemarkLBF(params);
```

## Pre-trained Models

To use FacemarkLBF, you need a pre-trained model file. You can download models from:

- [OpenCV Face Module Models](https://github.com/kurnianggoro/GSOC2017/tree/master/data)
- The default LBF model: `lbfmodel.yaml` (~56MB)

## Resources

- [OpenCV Face Module Documentation](https://docs.opencv.org/4.x/d1/d1d/group__face.html)
- [FacemarkLBF Paper](https://www.cv-foundation.org/openaccess/content_cvpr_2014/papers/Ren_Face_Alignment_at_2014_CVPR_paper.pdf)
- [Building opencv.js](https://docs.opencv.org/4.x/d4/da1/tutorial_js_setup.html)
- [opencv_contrib Repository](https://github.com/opencv/opencv_contrib)

## Summary

1. **Type definitions are available** - This package includes TypeScript types for `cv.face.createFacemarkLBF`
2. **Runtime not available by default** - The face module is not in the default opencv.js build
3. **Custom build required** - To use face module at runtime, build opencv.js from source with opencv_contrib
4. **Alternatives exist** - Consider using FaceDetectorYN or CascadeClassifier if you only need face detection

If you have questions or need help building opencv.js with the face module, please open an issue on GitHub.
