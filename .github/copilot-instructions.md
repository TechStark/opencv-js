# OpenCV-JS Package Development Instructions

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

OpenCV-JS is a TypeScript NPM package that provides OpenCV.js (JavaScript/WebAssembly version of OpenCV) for both Node.js and browser environments. The package wraps a pre-built 11MB OpenCV.js WASM binary with TypeScript type definitions.

## Working Effectively

### Initial Setup and Build
- Install dependencies: `npm install` -- takes ~15 seconds
- Build TypeScript: `npm run build` -- takes ~2 seconds. NEVER CANCEL. Set timeout to 60+ seconds.
- Run tests: `npm test` -- takes ~8 seconds. NEVER CANCEL. Set timeout to 300+ seconds.
- Format code: `npm run format` -- takes ~1 second

### Build Process Validation
- ALWAYS run the complete build process: `npm install && npm run build && npm test`
- Test package creation: `npm pack` -- creates .tgz file for distribution testing
- ALWAYS run `npm audit fix` to address security vulnerabilities before committing

### Manual Testing and Validation
- ALWAYS test OpenCV functionality after making changes using this pattern:
```javascript
const cv = await require('./dist/opencv.js');
global.cv = cv;
const mat = new cv.Mat(3, 3, cv.CV_8UC1);
console.log(`Mat: ${mat.rows}x${mat.cols}, channels: ${mat.channels()}`);
mat.delete(); // CRITICAL: Always call delete() for memory management
```

### Memory Management Requirements
- ALWAYS call `.delete()` on OpenCV objects (Mat, Size, etc.) to prevent memory leaks
- NEVER forget memory cleanup in tests and examples
- Use try/catch with proper cleanup in finally blocks when appropriate

## Package Usage Patterns

### v4.11+ API (Current)
```javascript
import cvReadyPromise from "@techstark/opencv-js";
const cv = await cvReadyPromise;
// Use cv here
```

### v4.10- API (Legacy)
```javascript
import cv from "@techstark/opencv-js";
cv.onRuntimeInitialized = () => {
  // Use cv here
};
```

### Browser Configuration
- ALWAYS include webpack polyfills for browser usage:
```javascript
module.exports = {
  resolve: {
    fallback: {
      fs: false,
      path: false,
      crypto: false
    }
  }
};
```

## Testing and Validation

### Running Tests
- Unit tests use Jest with TypeScript preset
- Tests validate: Mat operations, image processing, color conversions, tracking
- Test files include: `Mat.test.ts`, `Tracker.test.ts`, `rect.test.ts`, `cvKeys.test.ts`
- ALWAYS wait for async OpenCV initialization in tests using `setupOpenCv()` helper

### Key Validation Scenarios
After making changes, ALWAYS test these scenarios:
1. Basic Mat creation and property access
2. Color space conversion (RGBA2GRAY)
3. Image filtering operations (GaussianBlur, threshold)
4. Contour detection and processing
5. Memory cleanup with .delete() calls

### Testing with Real Images
- Use `test/Lenna.png` for image processing tests
- Use Jimp library for loading images in Node.js environment
- Pattern: `const jimpSrc = await Jimp.read(path); const img = cv.matFromImageData(jimpSrc.bitmap);`

## File Structure and Navigation

### Key Directories
- `src/` - TypeScript source (mainly type definitions)
  - `src/index.ts` - Main export (32 bytes, exports from types/opencv)
  - `src/types/` - Comprehensive OpenCV type definitions
- `test/` - Jest test files with OpenCV functionality validation
- `dist/` - Build output including the 11MB opencv.js binary
- `.github/workflows/` - CI/CD configuration

### Important Files
- `dist/opencv.js` - Pre-built OpenCV.js WASM binary (11MB, core functionality)
- `package.json` - NPM configuration with build/test scripts
- `tsconfig.json` - TypeScript compilation settings
- `jest.config.js` - Jest testing configuration
- `doc/cvKeys.json` - Runtime OpenCV methods and properties reference

### Type Definitions Structure
- Over 100 TypeScript definition files in `src/types/opencv/`
- Core modules: Mat.ts, core_array.ts, imgproc_*.ts, calib3d.ts
- Always check existing type definitions before adding new ones

## CI/CD and Publishing

### GitHub Workflows
- `unit-test.yml` - Runs on PRs/pushes, uses Node.js 20.x, sets NODE_OPTIONS for memory
- `build-opencv.yml` - Manual workflow for building opencv.js from source (uses Emscripten 2.0.10)
- `npm-publish.yml` - Publishes to NPM on releases

### Build Requirements
- Node.js 20.x (as used in CI)
- NEVER CANCEL builds or tests - they may take longer than expected
- Set explicit timeouts: 60+ seconds for builds, 300+ seconds for tests

## Common Development Tasks

### Adding New OpenCV Features
1. Check if types exist in `src/types/opencv/`
2. Add type definitions following existing patterns
3. Create test in appropriate test file
4. Run full validation: `npm run build && npm test`
5. Test with real OpenCV operations, not just TypeScript compilation

### Updating Dependencies
- Use `npm audit fix` for security updates
- Test package creation with `npm pack` after updates
- ALWAYS run full test suite after dependency changes

### Memory Debugging
- Check for missing `.delete()` calls in tests and examples
- Use `translateException()` helper for OpenCV error handling
- Monitor memory usage in long-running operations

## Browser vs Node.js Differences

### Node.js Environment
- Direct require() of opencv.js works
- Can use filesystem for loading images
- Full OpenCV functionality available

### Browser Environment  
- Requires webpack polyfills (fs: false, path: false, crypto: false)
- Must handle async WASM loading
- Limited to browser-compatible image loading methods

## Performance and Timing Expectations

### Build Times (NEVER CANCEL)
- `npm install`: ~15 seconds
- `npm run build`: ~2 seconds
- `npm test`: ~8 seconds  
- `npm run format`: ~1 second
- Full CI pipeline: ~2-3 minutes

### Package Size
- Source: ~12.8MB unpacked, ~4.1MB packed
- Main contributor: dist/opencv.js (11MB WASM binary)
- 214 files total in package

## Troubleshooting

### Common Issues
- **TypeError: cv.Mat is not a constructor** - OpenCV not properly initialized, use await pattern
- **Memory issues** - Missing .delete() calls on OpenCV objects
- **Browser webpack errors** - Missing fallback polyfills configuration
- **Test failures** - OpenCV async initialization not awaited in setupOpenCv()

### Debug Commands
- `node -e "console.log(require('./dist/opencv.js'))"` - Test opencv.js loading
- `npm audit` - Check for security vulnerabilities  
- `npm pack && tar -tzf *.tgz | head -20` - Inspect package contents

ALWAYS follow these patterns for reliable OpenCV-JS development and avoid common pitfalls with async initialization and memory management.