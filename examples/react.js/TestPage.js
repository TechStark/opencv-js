import React from "react";
import cv from "@techstark/opencv-js";

// window.cv = cv;

class TestPage extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.outputRef = React.createRef();
    this.state = {
      imgUrl: "",
    };
  }

  render() {
    const { imgUrl } = this.state;
    return (
      <div>
        <div>
          Select an image file as input{" "}
          <input
            type="file"
            name="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files[0]) {
                this.setState({
                  imgUrl: URL.createObjectURL(e.target.files[0]),
                });
              }
            }}
          />
        </div>

        <div className="input-image">
          {imgUrl && (
            <img
              alt="Select a file"
              src={imgUrl}
              onLoad={(e) => {
                //
                // process image with opencv.js
                //
                const mat = cv.imread(e.target);
                const imgGray = new cv.Mat();
                cv.cvtColor(mat, imgGray, cv.COLOR_BGR2GRAY);
                cv.imshow(this.outputRef.current, imgGray);
                mat.delete();
                imgGray.delete();
              }}
            />
          )}
        </div>

        <div className="output-image">
          <canvas ref={this.outputRef} />
        </div>
      </div>
    );
  }
}

export default TestPage;
