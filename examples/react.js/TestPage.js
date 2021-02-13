import React from 'react';
import cv from '@techstark/opencv-js';

// window.cv = cv;

class TestPage extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.outputRef = React.createRef();
  }

  render() {
    return (
      <div>
        <div className="input-image">
          <img
            alt="Select a file"
            ref={this.inputRef}
            onLoad={(e) => {
              const mat = cv.imread(e.target);
              const imgGray = new cv.Mat();
              cv.cvtColor(mat, imgGray, cv.COLOR_BGR2GRAY);
              cv.imshow(this.outputRef.current, imgGray);
              mat.delete();
              imgGray.delete();
            }}
          />
          <div>
            Select an image file as input{' '}
            <input
              type="file"
              name="file"
              onChange={(e) => {
                this.inputRef.current.src = URL.createObjectURL(e.target.files[0]);
              }}
            />
          </div>
        </div>
        <div className="output-image">
          <canvas ref={this.outputRef} />
        </div>
      </div>
    );
  }
}

export default TestPage;
