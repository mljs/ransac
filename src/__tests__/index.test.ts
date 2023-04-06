import { ransac } from '..';
import { line, linearRegression } from '../utils/linearRegression';

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

test('horizontal line', () => {
  const source = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const destination = [-6, -2, 0, 5, 0, 0, -1, 1, 0, 0, -1, 0, 3];

  const result = ransac(source, destination, {
    distanceFunction,
    fitFunction,
    modelFunction,
    threshold: 1,
    sampleSize: 2,
    maxNbIterations: 3,
  });

  console.log(result);

  expect(result).toBe({
    modelParameters: [0, 0],
    inliers: [0, 2, 3, 4, 5, 6, 7, 8, 9],
  });
});

// test('different length error', () => {
//   const source = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
//   const destination = [-6, -2, 0];
// });
