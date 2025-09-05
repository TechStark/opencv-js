# opencv-js

OpenCV JavaScript version (NPM package) for node.js or browser. Get started guide [OpenCV.js Tutorials](https://docs.opencv.org/4.11.0/#:~:text=OpenCV%2DPython%20Tutorials-,OpenCV.js%20Tutorials,-Tutorials%20for%20contrib).

The file `opencv.js` was downloaded from https://docs.opencv.org/4.11.0/opencv.js

TypeScript is supported (thanks to `mirada`).

## OpenCV Contrib Modules Support

**NEW**: This package now includes TypeScript definitions for OpenCV contrib modules including `ximgproc.thinning()`.

**Note**: The default `opencv.js` build from docs.opencv.org does not include contrib modules. To use contrib modules like `cv.ximgproc.thinning()`, you need to build OpenCV.js with contrib modules enabled.

### Using contrib modules

To use contrib modules such as `cv.ximgproc.thinning()`:

1. **Build with contrib** (recommended): Use the GitHub Actions workflow in this repository to build opencv.js with contrib modules, or build locally using the instructions below.

2. **Build locally**:
   ```bash
   # Clone repositories
   git clone --branch 4.11.0 https://github.com/opencv/opencv.git
   git clone --branch 4.11.0 https://github.com/opencv/opencv_contrib.git
   
   # Install emscripten
   git clone https://github.com/emscripten-core/emsdk.git
   cd emsdk && ./emsdk install 2.0.10 && ./emsdk activate 2.0.10
   source emsdk_env.sh && cd ..
   
   # Build opencv.js with contrib
   emcmake python opencv/platforms/js/build_js.py build_js \
     --cmake_option="-DOPENCV_EXTRA_MODULES_PATH=../opencv_contrib/modules" \
     --cmake_option="-DBUILD_opencv_ximgproc=ON"
   ```

3. **Replace the opencv.js file** in this package with your contrib-enabled build.

### Example usage with contrib modules

```js
import cv from "@techstark/opencv-js";

cv.onRuntimeInitialized = () => {
  // Use ximgproc thinning function
  const src = cv.imread('input_image');
  const dst = new cv.Mat();
  
  // Apply thinning with Zhang-Suen algorithm
  cv.ximgproc.thinning(src, dst, cv.ximgproc.THINNING_ZHANGSUEN);
  
  console.log("Thinning complete!");
  dst.delete();
  src.delete();
};
```

# Basic Usage

## >=4.11

```js
import cvReadyPromise from "@techstark/opencv-js";

async function main() {
  const cv = await cvReadyPromise;
  console.log("OpenCV.js is ready!");
  // You can now use OpenCV functions here
  console.log(cv.getBuildInformation());
}
```

## <=4.10

```js
import cv from "@techstark/opencv-js";

cv.onRuntimeInitialized = () => {
  console.log("OpenCV.js is ready!");
  // You can now use OpenCV functions here
  console.log(cv.getBuildInformation());
};
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

# Star History

[![Star History Chart](https://api.star-history.com/svg?repos=techstark/opencv-js&type=Date)](https://star-history.com/#techstark/opencv-js&Date)
