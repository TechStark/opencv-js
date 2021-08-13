# opencv-js
OpenCV JavaScript version for node.js or browser. The file `opencv.js` was downloaded from https://docs.opencv.org/4.5.3/opencv.js

TypeScript is supported (thanks to `mirada`).

# Examples & Live Demo
## Using in react.js project
- See [live demo here](https://codesandbox.io/s/techstarkopencv-js-demo-page-f7gvk)
<img src="https://user-images.githubusercontent.com/132509/129300228-89955128-d852-4020-9ad5-30c69cc0c569.png" height="800px" alt="Live demo screenshot" />

- See example in [TestPage.js](examples/react.js/TestPage.js)

# How to Use
- `npm install @techstark/opencv-js`
- or `yarn add @techstark/opencv-js`

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
