import { setupOpenCv } from "./cv";

beforeAll(setupOpenCv);

describe("applyColorMap", () => {
  it("should apply COLORMAP_JET to a grayscale image", async () => {
    // Create a simple grayscale image
    const src = new cv.Mat(100, 100, cv.CV_8UC1);
    
    // Fill with gradient values
    for (let i = 0; i < 100; i++) {
      for (let j = 0; j < 100; j++) {
        src.ucharPtr(i, j)[0] = Math.floor((i + j) * 255 / 200);
      }
    }
    
    const dst = new cv.Mat();
    
    // Apply JET colormap
    cv.applyColorMap(src, dst, cv.COLORMAP_JET);
    
    // Verify the output is a 3-channel color image
    expect(dst.channels()).toBe(3);
    expect(dst.rows).toBe(100);
    expect(dst.cols).toBe(100);
    expect(dst.type()).toBe(cv.CV_8UC3);
    
    // Clean up
    src.delete();
    dst.delete();
  });

  it("should have all COLORMAP constants available", () => {
    // Test that all colormap constants are defined
    expect(typeof cv.COLORMAP_JET).toBe('number');
    expect(typeof cv.COLORMAP_AUTUMN).toBe('number');
    expect(typeof cv.COLORMAP_BONE).toBe('number');
    expect(typeof cv.COLORMAP_WINTER).toBe('number');
    expect(typeof cv.COLORMAP_RAINBOW).toBe('number');
    expect(typeof cv.COLORMAP_OCEAN).toBe('number');
    expect(typeof cv.COLORMAP_SUMMER).toBe('number');
    expect(typeof cv.COLORMAP_SPRING).toBe('number');
    expect(typeof cv.COLORMAP_COOL).toBe('number');
    expect(typeof cv.COLORMAP_HSV).toBe('number');
    expect(typeof cv.COLORMAP_PINK).toBe('number');
    expect(typeof cv.COLORMAP_HOT).toBe('number');
    expect(typeof cv.COLORMAP_PARULA).toBe('number');
    expect(typeof cv.COLORMAP_MAGMA).toBe('number');
    expect(typeof cv.COLORMAP_INFERNO).toBe('number');
    expect(typeof cv.COLORMAP_PLASMA).toBe('number');
    expect(typeof cv.COLORMAP_VIRIDIS).toBe('number');
    expect(typeof cv.COLORMAP_CIVIDIS).toBe('number');
    expect(typeof cv.COLORMAP_TWILIGHT).toBe('number');
    expect(typeof cv.COLORMAP_TWILIGHT_SHIFTED).toBe('number');
    expect(typeof cv.COLORMAP_TURBO).toBe('number');
    expect(typeof cv.COLORMAP_DEEPGREEN).toBe('number');
  });

  it("should apply different colormaps correctly", async () => {
    // Create a simple grayscale image
    const src = new cv.Mat(50, 50, cv.CV_8UC1, new cv.Scalar(128));
    const dst1 = new cv.Mat();
    const dst2 = new cv.Mat();
    
    // Apply different colormaps
    cv.applyColorMap(src, dst1, cv.COLORMAP_JET);
    cv.applyColorMap(src, dst2, cv.COLORMAP_VIRIDIS);
    
    // Both should be 3-channel color images
    expect(dst1.channels()).toBe(3);
    expect(dst2.channels()).toBe(3);
    
    // Different colormaps should produce different results
    const data1 = dst1.data;
    const data2 = dst2.data;
    let different = false;
    for (let i = 0; i < Math.min(data1.length, data2.length); i++) {
      if (data1[i] !== data2[i]) {
        different = true;
        break;
      }
    }
    expect(different).toBe(true);
    
    // Clean up
    src.delete();
    dst1.delete();
    dst2.delete();
  });
});