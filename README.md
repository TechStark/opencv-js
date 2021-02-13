# opencv-js
OpenCV JavaScript version for node.js or browser. The file `opencv.js` was downloaded from https://docs.opencv.org/4.5.1/opencv.js

TypeScript is also supported (thanks to `mirada`).

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

# Examples
## Using in react.js project
See example in [TestPage.js](examples/react.js/TestPage.js)
