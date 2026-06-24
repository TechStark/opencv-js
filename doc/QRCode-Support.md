# QRCode Support in OpenCV.js

This document explains the current state of QR code functionality in opencv-js.

## Available QR Code Functionality

### QRCodeDetector ✅
The `QRCodeDetector` class is fully available and functional:

```typescript
const detector = new cv.QRCodeDetector();
const image = cv.imread(imageElement);
const points = new cv.Mat();
const straightQrcode = new cv.Mat();

// Detect and decode QR code
const decodedText = detector.detectAndDecode(image, points, straightQrcode);
console.log("Decoded text:", decodedText);
```

### QRCodeDetectorAruco ✅
Enhanced QR code detection using ArUco-based methods:

```typescript
const params = new cv.QRCodeDetectorAruco_Params();
const detector = new cv.QRCodeDetectorAruco(params);
```

### QRCodeEncoder Constants ✅
All QRCodeEncoder constants are available:

```typescript
// Correction levels
cv.QRCodeEncoder_CORRECT_LEVEL_L  // Low
cv.QRCodeEncoder_CORRECT_LEVEL_M  // Medium  
cv.QRCodeEncoder_CORRECT_LEVEL_Q  // Quartile
cv.QRCodeEncoder_CORRECT_LEVEL_H  // High

// Encoding modes
cv.QRCodeEncoder_MODE_NUMERIC
cv.QRCodeEncoder_MODE_ALPHANUMERIC
cv.QRCodeEncoder_MODE_BYTE
cv.QRCodeEncoder_MODE_KANJI
cv.QRCodeEncoder_MODE_ECI
cv.QRCodeEncoder_MODE_STRUCTURED_APPEND
cv.QRCodeEncoder_MODE_AUTO

// ECI encodings
cv.QRCodeEncoder_ECI_UTF8
```

### QRCodeEncoder Enums ✅
Enum classes are available:

```typescript
cv.QRCodeEncoder_CorrectionLevel
cv.QRCodeEncoder_EncodeMode  
cv.QRCodeEncoder_ECIEncodings
```

## Missing Functionality

### QRCodeEncoder Class ❌
The actual `QRCodeEncoder` class is **not available** in the current OpenCV.js build, although TypeScript definitions are provided for future compatibility.

```typescript
// This will throw an error:
const encoder = new cv.QRCodeEncoder(); // ❌ Not available
```

## Workarounds

For QR code generation, consider using external libraries such as:

- [qrcode](https://www.npmjs.com/package/qrcode)
- [qr-code-generator](https://www.npmjs.com/package/qr-code-generator)
- [qrious](https://www.npmjs.com/package/qrious)

## Future Support

The TypeScript definitions for `QRCodeEncoder` are included for when this functionality becomes available in future OpenCV.js builds.