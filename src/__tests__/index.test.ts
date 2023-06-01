import { writeSync } from 'image-js';
import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { ransac } from '..';
import { applyRigidTransfom } from '../rigidTransform/applyRigidTransform';
import { createRigidTransformModel } from '../rigidTransform/createRigidTransformModel';
import { getEuclidianDistance } from '../rigidTransform/getEuclidianDistance';
import { getRigidTransformArray } from '../rigidTransform/getRigidTransform';
import { drawResult } from '../toMigrate/forImageJs/drawResult';
import { line, linearRegression } from '../utils/linearRegression';
import { parabola, parabolaRegression } from '../utils/parabola';

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
describe('linear regressions', () => {
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
});

test('parabola', () => {
  const source = [-4, -3, -2, -1, 0, 1, 2, 3, 6];
  const destination = [2, 9, 4, 1, 0, 1, 4, 9, 4];

  const result = ransac(source, destination, {
    distanceFunction,
    modelFunction: parabola,
    fitFunction: parabolaRegression,
    seed: 0,
  });

  expect(result.nbIterations).toBe(100);
  expect(result.modelParameters).toBeDeepCloseTo([0.98, 0, 0.11], 1);
  expect(result.inliers).toStrictEqual([1, 2, 3, 4, 5, 6, 7]);
});

describe('2D data (points)', () => {
  it('6 points perfectly aligned', () => {
    const source = [
      { row: 2, column: 2 },
      { row: 3, column: 2 },
      { row: 4, column: 2 },
      { row: 5, column: 2 },
      { row: 6, column: 2 },
      { row: 7, column: 2 },
    ];
    const destination = [
      { row: 2, column: -2 },
      { row: 1, column: -2 },
      { row: 0, column: -2 },
      { row: -1, column: -2 },
      { row: -2, column: -2 },
      { row: -3, column: -2 },
    ];

    const result = ransac(source, destination, {
      distanceFunction: getEuclidianDistance,
      modelFunction: createRigidTransformModel,
      fitFunction: getRigidTransformArray,
    });

    expect(result.modelParameters).toStrictEqual([180, 0, 4]);
  });
  it('6 points with outliers', () => {
    const source = [
      { row: 2, column: 2 },
      { row: 3, column: 2 },
      { row: 4, column: 2 },
      { row: 5, column: 2 },
      { row: 6, column: 2 },
      { row: 7, column: 2 },
    ];
    const destination = [
      { row: 2, column: -10 }, // outlier
      { row: 1, column: -2 },
      { row: 0, column: -10 }, // outlier
      { row: -1, column: -2 },
      { row: -2, column: -2 },
      { row: -3, column: -2 },
    ];

    const result = ransac(source, destination, {
      distanceFunction: getEuclidianDistance,
      modelFunction: createRigidTransformModel,
      fitFunction: getRigidTransformArray,
    });

    expect(result.modelParameters).toStrictEqual([180, 0, 4]);
    expect(result.inliers).toStrictEqual([1, 3, 4, 5]);
  });
  test('polygon rotated 180 degrees', () => {
    const source = [
      { column: 4, row: 3 },
      { column: 2, row: 5 },
      { column: 5, row: 6 },
      { column: 7, row: 5 },
      { column: 6, row: 3 },
      { column: 5, row: 4 },
    ];
    const destination = [
      { column: 5, row: -1 },
      { column: 7, row: -3 },
      { column: 4, row: -4 },
      { column: 2, row: -3 },
      { column: 3, row: -1 },
      { column: 4, row: -2 },
    ];
    const result = ransac(source, destination, {
      distanceFunction: getEuclidianDistance,
      modelFunction: createRigidTransformModel,
      fitFunction: getRigidTransformArray,
    });

    expect(result.modelParameters).toBeDeepCloseTo([180, 9, 2]);

    const model = createRigidTransformModel(result.modelParameters);
    const resultPoints = applyRigidTransfom(source, model);

    expect(resultPoints).toBeDeepCloseTo(destination);

    const image = drawResult(source, destination, resultPoints);

    writeSync(`${__dirname}/polygon1.png`, image);
  });
  test('polygon rotated 90 degrees', () => {
    const source = [
      { column: -6, row: -1 },
      { column: -4, row: -2 },
      { column: -3, row: 1 },
      { column: -3, row: 3 },
      { column: -5, row: 5 },
      { column: -7, row: 3 },
      { column: -5, row: 3 },
      { column: -5, row: 1 },
    ];
    const destination = [
      { column: -1, row: 6 },
      { column: -2, row: 4 },
      { column: 1, row: 3 },
      { column: 3, row: 3 },
      { column: 5, row: 5 },
      { column: 3, row: 7 },
      { column: 3, row: 5 },
      { column: 1, row: 5 },
    ];
    const result = ransac(source, destination, {
      distanceFunction: getEuclidianDistance,
      modelFunction: createRigidTransformModel,
      fitFunction: getRigidTransformArray,
    });

    expect(result.modelParameters).toBeDeepCloseTo([-90, 0, 0]);

    const model = createRigidTransformModel(result.modelParameters);
    const resultPoints = applyRigidTransfom(source, model);

    expect(resultPoints).toBeDeepCloseTo(destination);

    const image = drawResult(source, destination, resultPoints);

    writeSync(`${__dirname}/polygon2.png`, image);
  });
});
