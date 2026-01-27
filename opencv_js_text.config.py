# OpenCV.js configuration file for text module (opencv_contrib)
# This file defines which functions from the text module should be exported to JavaScript

text = {
    '': [
        'detectTextSWT',  # Stroke Width Transform text detection
    ],
    'ERFilter': [
        'run',
    ],
    'ERFilter_Callback': [],
    'BaseOCR': [
        'run',
    ],
    'OCRTesseract': [
        'run',
    ],
    'TextDetector': [
        'detect',
        'detectTextRectangles',
    ],
}

# Function to create whitelist structure
def makeWhiteList(modules):
    wl = {}
    for m in modules:
        wl.update(m)
    return wl

white_list = makeWhiteList([text])
