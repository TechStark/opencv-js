# Using SWT (Stroke Width Transform) for Text Detection

This guide explains how to use the Stroke Width Transform (SWT) feature in OpenCV.js for text detection in natural scene images.

## What is SWT?

Stroke Width Transform (SWT) is a text detection algorithm that works by analyzing the stroke widths in an image to identify potential text regions. It's particularly effective for detecting text in natural scenes where traditional OCR approaches may struggle.

## Prerequisites

The default opencv.js binary does **not** include the text module. You need to build a custom version with opencv_contrib modules enabled.

### Building OpenCV.js with Text Module Support

1. Navigate to the [Actions tab](../../actions/workflows/build-opencv-js.yml) in this repository
2. Click "Run workflow"
3. Configure the build:
   - Set **enable_contrib** to `true` (this is the key parameter)
   - Choose your **opencv_version** (default: 4.13.0)
   - Set **emscripten_version** if needed (default: 2.0.10)
4. Wait for the build to complete (~20-30 minutes)
5. Download the generated `opencv.js` file from the release artifacts
6. Replace your `dist/opencv.js` with the custom-built version

## Basic Usage

### Node.js Example

```javascript
const cv = require('./dist/opencv.js');
const fs = require('fs');
const Jimp = require('jimp');

async function detectText() {
  // Wait for OpenCV to be ready
  await new Promise((resolve) => {
    if (cv.Mat) {
      resolve();
    } else {
      cv.onRuntimeInitialized = resolve;
    }
  });

  // Load an image using Jimp
  const image = await Jimp.read('./test-image.jpg');
  
  // Convert to OpenCV Mat
  const src = cv.matFromImageData({
    data: new Uint8Array(image.bitmap.data),
    width: image.bitmap.width,
    height: image.bitmap.height
  });

  // Prepare output containers
  const results = new cv.RectVector();
  const draw = new cv.Mat();
  const chainBBs = new cv.Mat();

  // Detect text using SWT
  // Parameters:
  //   - src: input image
  //   - results: output vector of rectangles where text was detected
  //   - true/false: is text dark on light background (true) or light on dark (false)
  //   - draw: optional visualization Mat
  //   - chainBBs: optional chained bounding boxes Mat
  cv.detectTextSWT(src, results, true, draw, chainBBs);

  console.log(`Detected ${results.size()} text regions`);

  // Access individual text regions
  for (let i = 0; i < results.size(); i++) {
    const rect = results.get(i);
    console.log(`Region ${i}: x=${rect.x}, y=${rect.y}, width=${rect.width}, height=${rect.height}`);
  }

  // Clean up memory (IMPORTANT!)
  results.delete();
  draw.delete();
  chainBBs.delete();
  src.delete();
}

detectText().catch(console.error);
```

### Browser Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>SWT Text Detection</title>
  <script src="opencv.js"></script>
</head>
<body>
  <h1>Text Detection with SWT</h1>
  <input type="file" id="fileInput" accept="image/*">
  <canvas id="canvasOutput"></canvas>

  <script>
    let cv;

    // Wait for OpenCV to load
    async function onOpenCvReady() {
      cv = await cv;
      console.log('OpenCV.js is ready');
    }

    document.getElementById('fileInput').addEventListener('change', function(e) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
          detectText(img);
        };
        img.src = event.target.result;
      };

      reader.readAsDataURL(file);
    });

    function detectText(imgElement) {
      // Create Mat from image
      const src = cv.imread(imgElement);
      
      // Prepare output containers
      const results = new cv.RectVector();
      const draw = new cv.Mat();
      const chainBBs = new cv.Mat();

      try {
        // Detect text (dark text on light background)
        cv.detectTextSWT(src, results, true, draw, chainBBs);

        // Visualize results
        const dst = src.clone();
        for (let i = 0; i < results.size(); i++) {
          const rect = results.get(i);
          const point1 = new cv.Point(rect.x, rect.y);
          const point2 = new cv.Point(rect.x + rect.width, rect.y + rect.height);
          cv.rectangle(dst, point1, point2, [0, 255, 0, 255], 2);
        }

        // Display result
        cv.imshow('canvasOutput', dst);
        console.log(`Found ${results.size()} text regions`);

        // Clean up
        dst.delete();
      } finally {
        // Always clean up memory
        results.delete();
        draw.delete();
        chainBBs.delete();
        src.delete();
      }
    }

    // Initialize when OpenCV is ready
    if (typeof cv !== 'undefined') {
      onOpenCvReady();
    } else {
      var script = document.createElement('script');
      script.src = 'opencv.js';
      script.onload = onOpenCvReady;
      document.head.appendChild(script);
    }
  </script>
</body>
</html>
```

### TypeScript Example

```typescript
import cvModule from "@techstark/opencv-js";

async function detectTextTypescript() {
  // Get OpenCV instance
  const cv = await cvModule;

  // Load your image (implementation depends on your environment)
  const img = cv.imread('imageElementId');

  // Create output containers with proper types
  const results = new cv.RectVector();
  const draw = new cv.Mat();
  const chainBBs = new cv.Mat();

  try {
    // Detect text using SWT
    cv.detectTextSWT(img, results, true, draw, chainBBs);

    // Process results with type safety
    const numRegions: number = results.size();
    console.log(`Found ${numRegions} text regions`);

    for (let i = 0; i < numRegions; i++) {
      const rect = results.get(i);
      console.log(`Region ${i}:`, {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height
      });
    }
  } finally {
    // Memory cleanup
    results.delete();
    draw.delete();
    chainBBs.delete();
    img.delete();
  }
}
```

## Parameters Explained

### `detectTextSWT(input, result, dark_on_light, draw, chainBBs)`

- **input** (`InputArray`): The input image with 3 channels (RGB or BGR)
- **result** (`RectVector`): Output vector of bounding boxes where text is likely detected
- **dark_on_light** (`boolean`): 
  - `true`: Detect dark text on light background (most common)
  - `false`: Detect light text on dark background
  - This parameter significantly affects results as it reverses the gradient direction
- **draw** (`OutputArray`, optional): Visualization Mat showing detected letters with bounding boxes
- **chainBBs** (`OutputArray`, optional): Chained letter candidates showing probable text regions

## Tips for Best Results

1. **Choose the right dark_on_light setting**: This is crucial and depends on your image
   - Most text in photos: use `true` (dark on light)
   - Light text on dark backgrounds (e.g., subtitles): use `false`

2. **Image preprocessing**: For better results, consider:
   - Resizing very large images
   - Adjusting contrast
   - Converting to grayscale if needed (though SWT expects 3-channel input)

3. **Memory management**: Always call `.delete()` on OpenCV objects to prevent memory leaks

4. **Post-processing**: The detected rectangles may need:
   - Merging nearby rectangles
   - Filtering by size or aspect ratio
   - Grouping into text lines or words

## Troubleshooting

### "cv.detectTextSWT is not a function"

This means you're using the default opencv.js which doesn't include the text module. You need to build a custom version with opencv_contrib enabled (see "Building OpenCV.js with Text Module Support" above).

### Poor detection results

- Try toggling the `dark_on_light` parameter
- Ensure your image has sufficient contrast
- Consider preprocessing (resize, enhance contrast, etc.)
- Text must have relatively uniform stroke width

### Memory issues in browser

- Always call `.delete()` on all OpenCV objects
- Process images in batches if handling multiple images
- Consider reducing image size before processing

## References

- [OpenCV Text Module Documentation](https://docs.opencv.org/4.x/d8/de7/namespacecv_1_1text.html)
- [SWT Algorithm Paper](https://www.microsoft.com/en-us/research/publication/detecting-text-in-natural-scenes-with-stroke-width-transform/)
- [OpenCV.js Tutorials](https://docs.opencv.org/4.x/d5/d10/tutorial_js_root.html)
