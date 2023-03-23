import Random from 'ml-random';

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
   * Maximal distance between model and inliers.
   */
  maxDistance: number;
  /**
   * Fitting function.
   */
  fitFunction: FitFunction<DataType>;
  /**
   * Function used to compute the distance between two values.
   */
  distanceFunction: DistFunction<DataType>;
  /**
   * Number of iterations of the RANSAC algorithm.
   *
   * @default 10
   */
  nbIterations: number;
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
  const { sampleSize, maxDistance, fitFunction, distanceFunction } = options;

  if (source.length !== destination.length) {
    throw new Error('source and destination data should have the same length');
  }

  const indices = new Random().choice(sampleSize);

  const srcSubset = [];
  const dstSubset = [];
  for (let i of indices) {
    srcSubset.push(source[i]);
    dstSubset.push(source[i]);
  }

  return 42;
}
