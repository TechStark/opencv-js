# OpenCV-JS Package Development Instructions

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## About This Project

OpenCV-JS is a TypeScript NPM package that provides OpenCV.js (JavaScript/WebAssembly version of OpenCV) for both Node.js and browser environments. The package wraps a pre-built 11MB OpenCV.js WASM binary with TypeScript type definitions.

**Repository:** https://github.com/TechStark/opencv-js  
**NPM Package:** [@techstark/opencv-js](https://www.npmjs.com/package/@techstark/opencv-js)  
**Version:** 4.12.0-release.1

## Technology Stack

- **Language:** TypeScript
- **Runtime:** Node.js 20.x (also supports browser environments)
- **Build Tool:** TypeScript Compiler (tsc)
- **Testing:** Jest with ts-jest
- **Package Manager:** npm
- **OpenCV Version:** 4.12.0 (WebAssembly/JavaScript build)
- **Key Dependencies:** Jimp (for image loading in tests)

## Table of Contents

- [Working Effectively](#working-effectively)
- [Package Usage Patterns](#package-usage-patterns)
- [Testing and Validation](#testing-and-validation)
- [File Structure and Navigation](#file-structure-and-navigation)
- [CI/CD and Publishing](#cicd-and-publishing)
- [Common Development Tasks](#common-development-tasks)
- [Browser vs Node.js Differences](#browser-vs-nodejs-differences)
- [Performance and Timing Expectations](#performance-and-timing-expectations)
- [Troubleshooting](#troubleshooting)
- [Security Considerations](#security-considerations)
- [External Documentation](#external-documentation)
- [Contributing Guidelines](#contributing-guidelines)

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

## Security Considerations

### Dependency Security
- ALWAYS run `npm audit` before committing changes
- Use `npm audit fix` to automatically fix security vulnerabilities
- Review security advisories for OpenCV.js and WebAssembly-related issues
- Keep TypeScript and build dependencies up to date

### WASM Binary Safety
- The `dist/opencv.js` file is a pre-built WebAssembly binary from OpenCV.org
- Verify the source when updating: https://docs.opencv.org/4.12.0/opencv.js
- Do NOT accept modified opencv.js files from untrusted sources

### Memory Safety
- Always call `.delete()` on OpenCV objects to prevent memory leaks
- Memory leaks in WASM can cause browser crashes or performance degradation
- Use try/finally blocks to ensure cleanup even when errors occur

### Input Validation
- Validate image dimensions and formats before processing
- Handle invalid inputs gracefully to prevent crashes
- Be cautious with user-provided images in browser environments

## External Documentation

### OpenCV Resources
- [OpenCV.js Documentation](https://docs.opencv.org/4.12.0/d5/d10/tutorial_js_root.html)
- [OpenCV.js Tutorials](https://docs.opencv.org/4.12.0/#:~:text=OpenCV%2DPython%20Tutorials-,OpenCV.js%20Tutorials,-Tutorials%20for%20contrib)
- [OpenCV.js API Reference](https://docs.opencv.org/4.12.0/d0/de1/group__js.html)
- [OpenCV Build Information](https://docs.opencv.org/4.12.0/opencv.js)

### Package Resources
- [NPM Package Page](https://www.npmjs.com/package/@techstark/opencv-js)
- [GitHub Repository](https://github.com/TechStark/opencv-js)
- [Code Examples Repository](https://github.com/TechStark/opencv-js-examples)
- [Live Demo (React)](https://codesandbox.io/s/techstarkopencv-js-demo-page-f7gvk)
- [Live Demo (Angular)](https://codesandbox.io/s/techstark-opencv-js-angular-demo-hkmc1n)
- [Face Detection Demo](https://codesandbox.io/s/opencv-js-face-detection-i1i3u)

### TypeScript Resources
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)
- [ts-jest Configuration](https://kulshekhar.github.io/ts-jest/)

## Contributing Guidelines

### Before Making Changes
1. Search existing issues and PRs to avoid duplicates
2. For significant changes, open an issue first to discuss
3. Fork the repository and create a feature branch
4. Ensure you understand the codebase by running: `npm install && npm run build && npm test`

### Making Changes
1. Follow existing code style and patterns
2. Add TypeScript type definitions for new OpenCV features
3. Include tests for new functionality in the `test/` directory
4. Update documentation if adding new features or changing behavior
5. Ensure all tests pass: `npm test`
6. Format code: `npm run format`
7. Check for security issues: `npm audit`

### Submitting Changes
1. Write clear, descriptive commit messages
2. Reference related issues in commit messages (e.g., "Fixes #123")
3. Ensure CI/CD workflows pass (unit tests, build)
4. Provide clear PR description explaining the changes
5. Be responsive to review feedback

### Code Review Process
- PRs require passing CI checks before merge
- Maintainer review is required
- Keep PRs focused and reasonably sized
- Update type definitions when adding new OpenCV methods

ALWAYS follow these patterns for reliable OpenCV-JS development and avoid common pitfalls with async initialization and memory management.