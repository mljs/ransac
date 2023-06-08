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

test('3 points', () => {
  const points = new Matrix([
    [2, 10, 12],
    [4, 2, 0],
    [0, 0, 0],
  ]);

  const result = getCentroid(points);
  expect(result.to2DArray()).toStrictEqual([[8], [2], [0]]);
});

test('first rectangle', () => {
  const points = new Matrix([
    [1, 5, 5, 1],
    [-4, -4, -2, -2],
    [0, 0, 0, 0],
  ]);

  const result = getCentroid(points);
  expect(result.to2DArray()).toStrictEqual([[3], [-3], [0]]);
});

test('second rectangle', () => {
  const points = new Matrix([
    [-6, -6, -2, -2],
    [10, 2, 2, 10],
    [1, 1, 1, 1],
  ]);

  const result = getCentroid(points);
  expect(result.to2DArray()).toStrictEqual([[-4], [6], [0]]);
});
