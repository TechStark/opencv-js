/**
 * Utility functions for checking OpenCV contrib module availability
 */

/**
 * Check if opencv_contrib modules are available in the current OpenCV.js build
 * @returns Object with availability status and missing modules
 */
export function checkContribAvailability() {
  const result = {
    hasContrib: false,
    hasXimgproc: false,
    missingModules: [] as string[],
    buildInfo: '',
  };

  try {
    // Check if cv is available
    if (typeof cv === 'undefined') {
      result.missingModules.push('OpenCV.js not loaded');
      return result;
    }

    // Get build information
    if (cv.getBuildInformation) {
      result.buildInfo = cv.getBuildInformation();
      
      // Check if contrib modules are mentioned in build info
      const buildInfo = result.buildInfo.toLowerCase();
      result.hasContrib = buildInfo.includes('ximgproc') || buildInfo.includes('contrib');
    }

    // Check specific modules
    result.hasXimgproc = !!(cv as any).ximgproc;
    
    if (!result.hasXimgproc) {
      result.missingModules.push('ximgproc');
    }

  } catch (error) {
    result.missingModules.push(`Error checking: ${error}`);
  }

  return result;
}

/**
 * Get a helpful message about how to enable contrib modules
 */
export function getContribHelpMessage(): string {
  const availability = checkContribAvailability();
  
  if (availability.hasXimgproc) {
    return '✅ OpenCV contrib modules are available!';
  }

  return `
❌ OpenCV contrib modules are not available in the current build.

To use cv.ximgproc.thinning() and other contrib functions:

1. Build OpenCV.js with contrib modules:
   npm run build:contrib
   
2. Or build manually:
   ./scripts/build-contrib.sh
   
3. Or use the GitHub Actions workflow to build automatically

Missing modules: ${availability.missingModules.join(', ')}

For more information, see: https://github.com/TechStark/opencv-js#opencv-contrib-modules-support
`.trim();
}

/**
 * Example usage of ximgproc.thinning (will only work with contrib build)
 */
export function exampleThinning() {
  const availability = checkContribAvailability();
  
  if (!availability.hasXimgproc) {
    console.warn(getContribHelpMessage());
    return;
  }

  console.log('✅ ximgproc module is available!');
  console.log('Example: cv.ximgproc.thinning(src, dst, cv.ximgproc.THINNING_ZHANGSUEN)');
  
  // Example code (commented out to avoid runtime errors)
  /*
  const src = cv.imread('input');
  const dst = new cv.Mat();
  cv.ximgproc.thinning(src, dst, cv.ximgproc.THINNING_ZHANGSUEN);
  cv.imshow('output', dst);
  dst.delete();
  src.delete();
  */
}