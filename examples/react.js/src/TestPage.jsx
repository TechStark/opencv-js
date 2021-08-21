import React from "react";
import cv from "@techstark/opencv-js";
// window.cv = cv;

class TestPage extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.output1Ref = React.createRef();
    this.output2Ref = React.createRef();
    this.state = {
      imgUrl: null,
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
                  imgUrl: URL.createObjectURL(e.target.files[0]),
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
                /////////////////////////////////////////
                //
                // process image with opencv.js
                //
                /////////////////////////////////////////
                const img = cv.imread(e.target);

                const imgGray = new cv.Mat();
                cv.cvtColor(img, imgGray, cv.COLOR_BGR2GRAY);
                cv.imshow(this.output1Ref.current, imgGray);

                const edges = new cv.Mat();
                cv.Canny(imgGray, edges, 100, 100);
                cv.imshow(this.output2Ref.current, edges);

                img.delete();
                imgGray.delete();
                edges.delete();
              }}
            />
          )}
        </div>

        <div className="output-image">
          {imgUrl && (
            <div style={{ margin: "10px" }}>↓↓↓ The gray scale image ↓↓↓</div>
          )}
          <canvas ref={this.output1Ref} />
        </div>

        <div className="output-image">
          {imgUrl && (
            <div style={{ margin: "10px" }}>↓↓↓ Canny Edge Result ↓↓↓</div>
          )}
          <canvas ref={this.output2Ref} />
        </div>
      </div>
    );
  }
}

export default TestPage;
