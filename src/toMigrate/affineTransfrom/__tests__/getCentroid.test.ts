import Matrix from 'ml-matrix';

import { getCentroid } from '../getCentroid';

test('two points', () => {
  const points = new Matrix([
    [2, 10],
    [4, 2],
    [0, 0],
  ]);

  const result = getCentroid(points);
  expect(result.to2DArray()).toStrictEqual([[6], [3], [0]]);
});

test('two points', () => {
  const points = new Matrix([
    [2, 10, 12],
    [4, 2, 0],
    [0, 0, 0],
  ]);

  const result = getCentroid(points);
  expect(result.to2DArray()).toStrictEqual([[8], [2], [0]]);
});
