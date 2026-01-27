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

# Building OpenCV.js with SWT (Stroke Width Transform) Support

The default `opencv.js` binary included in this package does not include the text module from opencv_contrib. To use SWT (Stroke Width Transform) and other text detection functions, you need to build a custom version of opencv.js.

## How to Build with Text Module Support

This repository includes a GitHub Actions workflow that can build opencv.js with opencv_contrib modules enabled:

1. Go to the [Actions tab](../../actions/workflows/build-opencv-js.yml) in this repository
2. Click "Run workflow"
3. Set the following parameters:
   - **enable_contrib**: Set to `true` to include the text module
   - **opencv_version**: Choose your desired OpenCV version (default: 4.13.0)
   - **emscripten_version**: Emscripten version to use (default: 2.0.10)
4. Click "Run workflow" to start the build
5. Once complete, download the built `opencv.js` file from the release artifacts
6. Replace the `dist/opencv.js` file in your local installation with the newly built version

## Using SWT in Your Code

Once you have a custom-built opencv.js with text module support:

```js
import cvModule from "@techstark/opencv-js";

async function detectText() {
  const cv = await cvModule;
  
  // Load your image
  const img = cv.imread('imageId');
  
  // Detect text using SWT
  const results = new cv.RectVector();
  const draw = new cv.Mat();
  const chainBBs = new cv.Mat();
  
  // detectTextSWT(input, result, dark_on_light, draw, chainBBs)
  cv.detectTextSWT(img, results, true, draw, chainBBs);
  
  console.log(`Found ${results.size()} text regions`);
  
  // Clean up
  results.delete();
  draw.delete();
  chainBBs.delete();
  img.delete();
}
```

**Note**: SWT (Stroke Width Transform) is particularly useful for detecting text in natural scene images and works by analyzing stroke widths to identify potential text regions.

For more information about the text module, see the [OpenCV text module documentation](https://docs.opencv.org/4.x/d8/de7/namespacecv_1_1text.html).

# Star History

[![Star History Chart](https://api.star-history.com/svg?repos=techstark/opencv-js&type=Date)](https://star-history.com/#techstark/opencv-js&Date)
