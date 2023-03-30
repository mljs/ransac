import { levenbergMarquardt } from 'ml-levenberg-marquardt';
import Random from 'ml-random';
import { getPointLineDistance } from './utils/geometry';

import { linearRegression } from './utils/linearRegression';
import { mad } from './utils/mad';

type DistFunction<DataType> = (
  source: DataType,
  destination: DataType,
) => number;

type FitFunction<DataType> = (
  source: DataType[],
  destination: DataType[],
) => any;

export interface RansacOptions<DataType> {
  /**
   * Number of elements of the random subset.
   */
  sampleSize: number;
  /**
   * Maximal distance between model and inliers. The points for which the distance is equal to maxDistance are considered inliers.
   *
   * @default The median absolute deviation of the initial subset values to the model.
   */
  maxInlierDistance: number;
  /**
   * Fitting function.
   *
   * @default Linear regression.
   */
  fitFunction?: FitFunction<DataType>;
  /**
   * Function used to compute the distance from model to the value.
   */
  distanceFunction?: DistFunction<DataType>;
  /**
   * Number of iterations of the RANSAC algorithm.
   *
   * @default 100
   */
  maxNbIterations?: number;
  /**
   * Return current model if the number of inliers is bigger or equal to minNbInliers.
   */
  minNbInliers?: number;
  // TODO: add seed option?
}

/**
 * RANdom SAmple Consensus algorithm: find a model matching the data and ignoring outliers.
 * @link https://en.wikipedia.org/wiki/Random_sample_consensus
 *
 * @returns A very important number
 */
export function ransac<DataType>(
  source: DataType[],
  destination: DataType[],
  options: RansacOptions<DataType>,
): number {
  const {
    sampleSize,
    maxInlierDistance = mad(destination as number[]),
    fitFunction = linearRegression,
    distanceFunction = getPointLineDistance,
    maxNbIterations = 100,
    minNbInliers = getNbValues(options.minNbInliers, source.length),
  } = options;

  if (source.length !== destination.length) {
    throw new Error('source and destination data should have the same length');
  }

  let iteration = 0;

  while (iteration < maxNbIterations) {
    const indices = new Random().choice(sampleSize);

    const srcSubset = [];
    const dstSubset = [];
    for (let i of indices) {
      srcSubset.push(source[i]);
      dstSubset.push(source[i]);
    }

    const model = levenbergMarquardt(
      { x: srcSubset as number[], y: dstSubset as number[] },
      fitFunction,
    );
  }

  return 42;
}

function getNbValues(value: number, size: number): number {
  if (Number.isInteger(value)) {
    return value;
  } else {
    return Math.ceil(value * size);
  }
}
