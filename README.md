# opencv-js
OpenCV JavaScript version for node.js or browser

# How to Use
`yarn add @techstark/opencv-js` or `npm add @techstark/opencv-js`

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