import { ransac } from '..';
import { getPointLineDistance, Line } from '../utils/geometry';
import { line, linearRegression } from '../utils/linearRegression';

const fitFunction = linearRegression;
const modelFunction = line;

/**
 * Compute distance from data to model.
 *
 * @param source - Source value.
 * @param destination - Destination value.
 * @param model - Line model.
 * @returns Euclidian distance between data and model.
 */
function distanceFunction(
  source: number,
  destination: number,
  model: Line,
): number {
  const point = { x: source, y: destination };
  return getPointLineDistance(point, model);
}

test('horizontal line', () => {
  const source = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const destination = [-6, -2, 0, 5, 0, 0, -1, 1, 0, 0, -1, 0, 3];

  const result = ransac(source, destination, {
    distanceFunction,
    fitFunction,
    modelFunction,
    threshold: 1,
  });

  expect(result).toBe({});
});

// test('different length error', () => {
//   const source = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
//   const destination = [-6, -2, 0];
// });
