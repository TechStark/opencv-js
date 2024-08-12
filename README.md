# opencv-js

OpenCV JavaScript version (NPM package) for node.js or browser. Get started guide [OpenCV.js Tutorials](https://docs.opencv.org/4.10.0/#:~:text=OpenCV%2DPython%20Tutorials-,OpenCV.js%20Tutorials,-Tutorials%20for%20contrib).

The file `opencv.js` was downloaded from https://docs.opencv.org/4.10.0/opencv.js

TypeScript is supported (thanks to `mirada`).

# Code Examples

- See code examples (React, Angular) in [opencv-js-examples](https://github.com/TechStark/opencv-js-examples)

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
