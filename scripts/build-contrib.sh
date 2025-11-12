#!/bin/bash

# Build OpenCV.js with contrib modules
# This script builds OpenCV.js with opencv_contrib modules enabled

set -e

echo "🔧 Building OpenCV.js with contrib modules..."

# Check if directories exist
if [ ! -d "opencv" ]; then
    echo "📥 Cloning OpenCV..."
    git clone --depth 1 --branch 4.11.0 https://github.com/opencv/opencv.git
fi

if [ ! -d "opencv_contrib" ]; then
    echo "📥 Cloning OpenCV contrib..."
    git clone --depth 1 --branch 4.11.0 https://github.com/opencv/opencv_contrib.git
fi

if [ ! -d "emsdk" ]; then
    echo "📥 Installing Emscripten..."
    git clone https://github.com/emscripten-core/emsdk.git
    cd emsdk
    ./emsdk install 2.0.10
    ./emsdk activate 2.0.10
    cd ..
fi

echo "🏗️  Building OpenCV.js with contrib modules..."
source emsdk/emsdk_env.sh

emcmake python opencv/platforms/js/build_js.py build_opencv_contrib \
  --cmake_option="-DOPENCV_EXTRA_MODULES_PATH=../opencv_contrib/modules" \
  --cmake_option="-DBUILD_opencv_ximgproc=ON" \
  --cmake_option="-DBUILD_opencv_photo=ON" \
  --cmake_option="-DBUILD_opencv_features2d=ON" \
  --build_flags="-s WASM_ASYNC_COMPILATION=0"

echo "✅ Build complete! OpenCV.js with contrib is at: build_opencv_contrib/bin/opencv.js"
echo "📋 To use it, copy the file to replace dist/opencv.js in your project"
echo ""
echo "💡 To verify contrib modules are available, check the build information:"
echo "   node -e \"const cv = require('./build_opencv_contrib/bin/opencv.js'); console.log(cv.getBuildInformation());\""