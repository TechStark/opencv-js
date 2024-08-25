import path from "path";
import fs from "fs";
import * as ts from "typescript";
import { setupOpenCv } from "./cv";

beforeAll(setupOpenCv);

describe("CV keys", () => {
  function getObjectKeys(obj: any) {
    const keys: string[] = [];
    for (let key in obj) {
      if (!key.startsWith("dynCall")) {
        keys.push(key);
      }
    }
    // console.log(keys);
    return keys;
  }

  it("output CV keys", async () => {
    const objectNameMap: { [key: string]: any } = {
      cv: cv,
      "cv.Mat": new cv.Mat(),
    };

    const objectKeyMap: { [key: string]: string[] } = {
      buildInformation: cv.getBuildInformation(),
    };

    for (const objName in objectNameMap) {
      const obj = objectNameMap[objName];
      const keys = getObjectKeys(obj);
      objectKeyMap[objName] = keys;
    }

    // write the objectKeyMap to JSON file
    const jsonString = JSON.stringify(objectKeyMap, null, 2);
    const fileName = "../doc/cvKeys.json";
    const filePath = path.join(__dirname, fileName);
    fs.writeFileSync(filePath, jsonString);
  });
});
