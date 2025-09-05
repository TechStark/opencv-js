# Mat.reshape() Implementation

This package now includes a `reshape()` method for the `Mat` class that was missing from the original OpenCV.js build.

## Usage

```javascript
import cv from "@techstark/opencv-js";

// After OpenCV is loaded
const img = new cv.Mat(4, 4, cv.CV_8UC3); // 4x4 RGB image

// Reshape to different dimensions while preserving total data elements
const vectorized = img.reshape(-1, 3); // Auto-calculate channels, 3 rows
const singleChannel = img.reshape(1, 12); // Convert to single channel, 12 rows

// Clean up
img.delete();
vectorized.delete();
singleChannel.delete();
```

## Parameters

- `cn`: Number of channels in the result matrix. Use `-1` to auto-calculate based on the total elements and rows.
- `rows` (optional): Number of rows in the result matrix. If not specified, attempts to maintain matrix structure.

## Behavior

The `reshape()` method reorganizes matrix data without copying it, similar to OpenCV's native `reshape()` function:

- Total number of data elements (`rows × cols × channels`) must remain constant
- When `cn = -1`: Auto-calculates channels, usually defaults to 1 channel for vectorization
- When `rows` is specified: Calculates columns to fit the total elements
- Returns a new `Mat` object with the reshaped dimensions

## Common Use Cases

1. **Image vectorization**: Convert 2D image to 1D vector
   ```javascript
   const vector = image.reshape(-1, 1); // Single row vector
   ```

2. **Channel reorganization**: Change number of channels
   ```javascript
   const singleChannel = image.reshape(1); // Convert to grayscale layout
   ```

3. **Matrix flattening**: Convert multi-dimensional to 2D
   ```javascript
   const flattened = matrix.reshape(-1, totalPixels); // One row per pixel
   ```