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

# Loading Images

## In Browser

In browser environments, you can use `cv.imread()` to read from canvas or image elements:

```js
// Read from canvas element
const mat = cv.imread('canvasElementId');

// Read from image element
const mat = cv.imread('imageElementId');
```

## In Node.js

**Important:** `cv.imread()` does **not** work in Node.js because it requires browser DOM APIs (like `document`). Instead, use an image loading library like `jimp` and convert to a Mat:

```js
import { Jimp } from "jimp";
import cvModule from "@techstark/opencv-js";

async function main() {
  // Initialize OpenCV
  const cv = await cvModule;
  
  // Load image using jimp (supports jpg, png, bmp, tiff, gif)
  const jimpImage = await Jimp.read("path/to/image.png");
  
  // Convert to OpenCV Mat (jimp.bitmap contains ImageData)
  const img = cv.matFromImageData(jimpImage.bitmap);
  
  console.log(`Image loaded: ${img.rows}x${img.cols}, channels: ${img.channels()}`);
  
  // Process the image...
  const gray = new cv.Mat();
  cv.cvtColor(img, gray, cv.COLOR_RGBA2GRAY);
  
  // Always cleanup Mat objects to prevent memory leaks
  img.delete();
  gray.delete();
}

main();
```

For a complete working example, see the unit test [test/imread-nodejs.test.ts](test/imread-nodejs.test.ts).

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

# Star History

[![Star History Chart](https://api.star-history.com/svg?repos=techstark/opencv-js&type=Date)](https://star-history.com/#techstark/opencv-js&Date)
