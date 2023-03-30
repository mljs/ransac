import { levenbergMarquardt } from 'ml-levenberg-marquardt';
import Random from 'ml-random';
import { getPointLineDistance } from './utils/geometry';

import { line, linearRegression } from './utils/linearRegression';
import { mad } from './utils/mad';

type DistFunction<DataType> = (
  source: DataType,
  destination: DataType,
) => number;

type FitFunction<DataType> = (
  source: DataType[],
  destination: DataType[],
) => number[];

type ModelFunction<DataType> = (source: DataType[]) => DataType[];

type ModelCreator<DataType> = (parameters: number[]) => ModelFunction<DataType>;

export interface RansacOptions<DataType> {
  /**
   * Number of elements of the random subset. By default, a linear regression is used, for which the minimal number of values is 2.
   *
   * @default 2
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
   * Function that takes in parameters and outputs a model function.
   *
   * @default 100
   */
  modelFunction?: ModelCreator<DataType>;
  /**
   * Maximal number of iterations of the algorithm. Will only be reached if a model never has minNbInliers.
   *
   * @default 100
   */
  maxNbIterations?: number;
  /**
   * Return current model if the number of inliers is bigger or equal to minNbInliers.
   */
  minNbInliers: number;
  // TODO: add seed option?
}

export interface RansacOuput<DataType> {
  /**
   * Parameters of the model with the most inliers.
   */
  modelParameters: number[];
  /**
   * Inliers for the best model.
   */
  inliers: DataType[];
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
): RansacOuput<DataType> {
  const {
    sampleSize = 2,
    maxInlierDistance = 3, // todo: use mad
    fitFunction = linearRegression,
    distanceFunction = getPointLineDistance,
    modelFunction = line,
    maxNbIterations = 100,
    minNbInliers = getNbValues(options.minNbInliers, source.length),
  } = options;

  if (source.length !== destination.length) {
    throw new Error('source and destination data should have the same length');
  }

  let iteration = 0;

  let bestNbInliers = 0;
  let bestInliers: DataType[] = [];
  let bestModelParameters: number[] = [];

  while (iteration < maxNbIterations) {
    const indices = new Random().choice(sampleSize);

    const srcSubset = [];
    const dstSubset = [];
    for (let i of indices) {
      srcSubset.push(source[i]);
      dstSubset.push(source[i]);
    }

    const modelParameters = fitFunction(srcSubset, dstSubset);
    const model = modelFunction(modelParameters);

    const predictedDestination: DataType[] = model(destination);

    let nbInliers = 0;
    let inliers: DataType[] = [];
    for (let i = 0; i < destination.length; i++) {
      if (i in indices) {
        nbInliers++;
        continue;
      }
      const distance = distanceFunction(
        destination[i],
        predictedDestination[i],
      );
      if (distance < maxInlierDistance) {
        nbInliers++;
        inliers.push(source[i]);
      }
    }
    if (nbInliers > bestNbInliers) {
      bestNbInliers = nbInliers;
      bestInliers = inliers; // potential bug?
      bestModelParameters = modelParameters;
      if (nbInliers >= minNbInliers) {
        return { modelParameters, inliers };
      }
    }

    iteration++;
  }

  return { modelParameters: bestModelParameters, inliers: bestInliers };
}

function getNbValues(value: number, size: number): number {
  if (Number.isInteger(value)) {
    return value;
  } else {
    return Math.ceil(value * size);
  }
}
