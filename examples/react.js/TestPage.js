import React from "react";
import cv from "@techstark/opencv-js";
import "./styles.css";

// window.cv = cv;

class TestPage extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.outputRef = React.createRef();
    this.state = {
      imgUrl: null
    };
  }

  render() {
    const { imgUrl } = this.state;
    return (
      <div>
        <div style={{ marginTop: "30px" }}>
          <input
            type="file"
            name="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files[0]) {
                this.setState({
                  imgUrl: URL.createObjectURL(e.target.files[0])
                });
              }
            }}
          />
          <div>
            Select an image file. It will be converted to gray-scale image.
          </div>
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
          {imgUrl && (
            <div style={{ margin: "10px" }}>↓↓↓ The gray scale image ↓↓↓</div>
          )}
          <canvas ref={this.outputRef} />
        </div>
      </div>
    );
  }
}

export default function App() {
  return (
    <div className="App">
      <TestPage />
    </div>
  );
}
