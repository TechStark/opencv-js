#!/usr/bin/env node

/**
 * Apply patches to opencv.js for Node.js/tsx compatibility
 * 
 * This script patches the opencv.js file to:
 * 1. Fix Module variable declaration
 * 2. Add environment checks for browser-only functions (imshow, VideoCapture)
 */

const fs = require('fs');
const path = require('path');

const OPENCV_PATH = path.join(__dirname, '..', 'dist', 'opencv.js');

console.log('Applying patches to opencv.js...\n');

// Read the opencv.js file
let content = fs.readFileSync(OPENCV_PATH, 'utf-8');
let patchCount = 0;

// Patch 1: Fix the Module variable declaration issue
console.log('Patch 1: Module variable declaration');
const oldModuleDecl = '  if (typeof Module === \'undefined\')\n    Module = {};';
const newModuleDecl = '  if (typeof Module === \'undefined\')\n    var Module = {};';

if (content.includes(oldModuleDecl)) {
  content = content.replace(oldModuleDecl, newModuleDecl);
  console.log('  ✓ Applied\n');
  patchCount++;
} else if (content.includes(newModuleDecl)) {
  console.log('  ⚠ Already applied\n');
} else {
  console.log('  ✗ Pattern not found (may already be patched differently)\n');
}

// Patch 2: Add environment check to imshow function
console.log('Patch 2: imshow environment check');
const oldImshow = 'Module["imshow"]=function(canvasSource,mat){var canvas=null;if(typeof canvasSource==="string"){canvas=document.getElementById(canvasSource)}';
const newImshow = 'Module["imshow"]=function(canvasSource,mat){if(typeof document==="undefined"){throw new Error("cv.imshow() is only available in browser environments. It requires DOM API (canvas element) which is not available in Node.js. For Node.js, please use alternative methods like cv.imwrite() to save images to files.")}var canvas=null;if(typeof canvasSource==="string"){canvas=document.getElementById(canvasSource)}';

if (content.includes(oldImshow)) {
  content = content.replace(oldImshow, newImshow);
  console.log('  ✓ Applied\n');
  patchCount++;
} else if (content.includes(newImshow)) {
  console.log('  ⚠ Already applied\n');
} else {
  console.log('  ✗ Pattern not found\n');
  process.exit(1);
}

// Patch 3: Add environment check to VideoCapture function
console.log('Patch 3: VideoCapture environment check');
const oldVideoCapture = 'Module["VideoCapture"]=function(videoSource){var video=null;if(typeof videoSource==="string"){video=document.getElementById(videoSource)}';
const newVideoCapture = 'Module["VideoCapture"]=function(videoSource){if(typeof document==="undefined"){throw new Error("cv.VideoCapture() is only available in browser environments. It requires DOM API (video element) which is not available in Node.js.")}var video=null;if(typeof videoSource==="string"){video=document.getElementById(videoSource)}';

if (content.includes(oldVideoCapture)) {
  content = content.replace(oldVideoCapture, newVideoCapture);
  console.log('  ✓ Applied\n');
  patchCount++;
} else if (content.includes(newVideoCapture)) {
  console.log('  ⚠ Already applied\n');
} else {
  console.log('  ✗ Pattern not found\n');
  process.exit(1);
}

// Write the patched file
if (patchCount > 0) {
  fs.writeFileSync(OPENCV_PATH, content);
  console.log(`✓ Successfully applied ${patchCount} patch(es) to opencv.js`);
} else {
  console.log('ℹ No new patches applied (all already present)');
}
