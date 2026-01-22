# opencv-js

OpenCV JavaScript version (NPM package) for node.js or browser. Get started guide [OpenCV.js Tutorials](https://docs.opencv.org/4.12.0/#:~:text=OpenCV%2DPython%20Tutorials-,OpenCV.js%20Tutorials,-Tutorials%20for%20contrib).

The file `opencv.js` was downloaded from https://docs.opencv.org/4.12.0/opencv.js

TypeScript is supported (thanks to `mirada`).

# Basic Usage

```js
import cvModule from "@techstark/opencv-js";

async function getOpenCv() {
  let cv;
  if (cvModule instanceof Promise) {
    cv = await cvModule;
  } else {
    if (cvModule.Mat) {
      cv = cvModule;
    } else {
      await new Promise((resolve) => {
        cvModule.onRuntimeInitialized = () => resolve();
      });
      cv = cvModule;
    }
  }
  return { cv };
}

async function main() {
  const { cv } = await getOpenCv();
  console.log("OpenCV.js is ready!");
  // You can now use OpenCV functions here
  console.log(cv.getBuildInformation());
}

main();
```

# Code Examples

- See code examples (React, Angular, Node.js) in [opencv-js-examples](https://github.com/TechStark/opencv-js-examples)

# Live Demo

## Using in react.js project

- See [live demo and code here](https://codesandbox.io/s/techstarkopencv-js-demo-page-f7gvk?file=/src/TestPage.jsx)
  <img src="https://user-images.githubusercontent.com/132509/130320696-eaa3899b-2356-4e9f-bbc9-0a969465c58e.png" height="800px" alt="Live demo screenshot" />
- Get the test image from here [Lenna.png](test/Lenna.png)

## Using in Angular project

- See [code here](https://codesandbox.io/s/techstark-opencv-js-angular-demo-hkmc1n?file=/src/app/app.component.ts)

## Real-time face detection

- See [live demo and code here](https://codesandbox.io/s/opencv-js-face-detection-i1i3u)

![Real-time face detection](https://user-images.githubusercontent.com/132509/160820773-cdb023a6-77a2-4f2e-a0e9-fb06931c8f9f.gif)

# How to Use

- `npm install @techstark/opencv-js`
- or `yarn add @techstark/opencv-js`
- `import cv from "@techstark/opencv-js"`
  - for TypeScript, set `"esModuleInterop": true` in `tsconfig.json`
- or `import * as cv from "@techstark/opencv-js"`

# Webpack Configuration (for browser usage)

If you use this package for browsers, you need to set some polyfills. In the file "webpack.config.js", set

```js
module.exports = {
  resolve: {
    modules: [...],
    fallback: {
      fs: false,
      path: false,
      crypto: false
    }
  }
};
```

# What methods and properties are available

The TypeScript type declarations may not be up to date with the latest OpenCV.js. Refer to [cvKeys.json](doc/cvKeys.json) to check the available methods and properties at runtime.

# Browser vs Node.js Compatibility

This package works in both browser and Node.js environments. However, some functions are **browser-only** and will throw clear errors when used in Node.js:

- **`cv.imshow()`** - Requires HTML Canvas element (browser only)
  - For Node.js, use alternative methods like `cv.imwrite()` to save images to files
- **`cv.VideoCapture()`** - Requires HTML Video element (browser only)

All other OpenCV functionality (Mat operations, image processing, computer vision algorithms, etc.) works in both environments.

### Example Node.js Usage

```js
import cvModule from "@techstark/opencv-js";

async function main() {
  const cv = await cvModule;
  
  // ✓ Works in Node.js
  const mat = new cv.Mat(100, 100, cv.CV_8UC3);
  cv.GaussianBlur(mat, mat, new cv.Size(5, 5), 0);
  
  // ✗ Throws error in Node.js (browser only)
  // cv.imshow("canvas", mat); // Error: cv.imshow() is only available in browser environments
  
  mat.delete();
}
```

# Star History

[![Star History Chart](https://api.star-history.com/svg?repos=techstark/opencv-js&type=Date)](https://star-history.com/#techstark/opencv-js&Date)
