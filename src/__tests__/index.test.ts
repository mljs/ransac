import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { ransac } from '..';
import { line, linearRegression } from '../utils/linearRegression';

expect.extend({ toBeDeepCloseTo });

const fitFunction = linearRegression;
const modelFunction = line;

/**
 * Compute distance from data to model.
 *
 * @param value - Destination value.
 * @param predictedValue - Predicted value.
 * @returns Euclidian distance between data and model.
 */
function distanceFunction(value: number, predictedValue: number): number {
  return Math.abs(value - predictedValue);
}

test('zero error', () => {
  const source = [0, 1, 2, 3, 4, 5];
  const destination = [1, 2, 3, 4, 5, 6];

  const result = ransac(source, destination, {
    distanceFunction,
    fitFunction,
    modelFunction,
    threshold: 1.1,
    sampleSize: 2,
    maxNbIterations: 1,
  });

  expect(result.modelParameters).toBeDeepCloseTo([1, 1]);
  expect(result.inliers).toStrictEqual([0, 1, 2, 3, 4, 5]);
});

test('horizontal line', () => {
  const source = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const destination = [-6, -2, 0, 5, 0, 0, -1, 1, 0, 0, -1, 0, 3];

  const result = ransac(source, destination, {
    distanceFunction,
    fitFunction,
    modelFunction,
    threshold: 1.1,
    sampleSize: 2,
    maxNbIterations: 10,
    seed: 0,
  });

  expect(result).toMatchCloseTo({
    nbIterations: 10,
    modelParameters: [0, 0],
    inliers: [2, 4, 5, 6, 7, 8, 9, 10, 11],
    error: 1,
  });
});

test('diagonal line (slope = -1/2, offset = 2)', () => {
  const source = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const destination = [2, 5, 1, -2, 0, -0.5, -1.5, -1, -2, 1];

  const result = ransac(source, destination, {
    distanceFunction,
    fitFunction,
    modelFunction,
    seed: 0,
  });

  expect(result).toMatchCloseTo({
    nbIterations: 100,
    modelParameters: [-0.5, 2],
    inliers: [0, 2, 4, 5, 6, 7, 8],
    error: 0.5,
  });
});

test('minNbInliers = 3', () => {
  const source = [0, 1, 2, 3, 4, 5];
  const destination = [1, 2, 3, 4, 5, 0];

  const result = ransac(source, destination, {
    distanceFunction,
    fitFunction,
    modelFunction,
    minNbInliers: 3,
    seed: 0,
  });

  expect(result).toMatchCloseTo({
    nbIterations: 2,
    modelParameters: [1, 1],
    inliers: [0, 1, 2, 3, 4],
    error: 0,
  });
});

test('minNbInliers = 0.5', () => {
  const source = [0, 1, 2, 3, 4, 5];
  const destination = [1, 2, 3, 4, 5, 6];

  const result = ransac(source, destination, {
    distanceFunction,
    fitFunction,
    modelFunction,
    threshold: 1.1,
    sampleSize: 2,
    maxNbIterations: 100,
    minNbInliers: 0.5,
  });

  expect(result).toMatchCloseTo({
    nbIterations: 1,
    modelParameters: [1, 1],
    inliers: [0, 1, 2, 3, 4, 5],
    error: 0,
  });
});

test('outliersFraction = 0.5', () => {
  const source = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const destination = [-6, -2, 0, 5, 0, 0, -1, 1, 0, 0, -1, 0, 3];

  const result = ransac(source, destination, {
    distanceFunction,
    fitFunction,
    modelFunction,
    threshold: 1.1,
    sampleSize: 2,
    outliersFraction: 0.5,
    seed: 0,
  });

  expect(result.nbIterations).toBe(17);
});

test('different length error', () => {
  const source = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const destination = [-6, -2, 0];

  expect(() => {
    ransac(source, destination, {
      distanceFunction,
      fitFunction,
      modelFunction,
      threshold: 1.1,
      sampleSize: 2,
      maxNbIterations: 3,
    });
  }).toThrow('source and destination data should have the same length');
});
