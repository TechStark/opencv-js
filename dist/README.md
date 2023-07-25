## Build opencv.js

- see https://github.com/opencv/opencv/blob/4.x/platforms/js/README.md
- also https://docs.opencv.org/4.7.0/d4/da1/tutorial_js_setup.html

```sh
cd ~/apps/emsdk
./emsdk update
./emsdk install 2.0.10
./emsdk activate 2.0.10
```

- build

```sh
source ~/apps/emsdk/emsdk_env.sh
emcmake python ./platforms/js/build_js.py build_js --build_wasm
```

## Patch opencv.js

- To create a patch for the current version of opencv.js, run:

```
git diff > temp.patch
mv temp.patch dist/opencv.js.patch
```

- To apply the patch, run:

```sh
git apply dist/opencv.js.patch
```
