import type { Feature2D, float, int } from "./_types";

/**
 * https://docs.opencv.org/4.9.0/db/d95/classcv_1_1ORB.html
 */
export declare class ORB extends Feature2D {
  public constructor(
    nfeatures?: int,
    scaleFactor?: float,
    nlevels?: int,
    edgeThreshold?: int,
    firstLevel?: int,
    WTA_K?: int,
    scoreType?: ORBScoreType,
    patchSize?: int,
    fastThreshold?: int,
  );
}

type ORBScoreType = int;
export declare const ORB_HARRIS_SCORE: ORBScoreType;
export declare const ORB_FAST_SCORE: ORBScoreType;
