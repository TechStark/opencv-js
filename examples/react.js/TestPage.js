import React from 'react';
import cv from '@techstark/opencv-js';

// window.cv = cv;

class TestPage extends React.Component {
  constructor(props) {
    super(props);
    this.imgRef = React.createRef();
  }

  render() {
    return (
      <div>
        <div className="input-image">
          <img
            id="imageSrc"
            alt="Select a file"
            ref={this.imgRef}
            onLoad={(e) => {
              const mat = cv.imread(e.target);
              const imgGray = new cv.Mat();
              cv.cvtColor(mat, imgGray, cv.COLOR_BGR2GRAY);
              cv.imshow('canvasOutput', imgGray);
              mat.delete();
              imgGray.delete();
            }}
          />
          <div>
            Select an image file as input{' '}
            <input
              type="file"
              id="fileInput"
              name="file"
              onChange={(e) => {
                this.imgRef.current.src = URL.createObjectURL(e.target.files[0]);
              }}
            />
          </div>
        </div>
        <div className="output-image">
          <canvas id="canvasOutput" />
        </div>
      </div>
    );
  }
}

export default TestPage;
