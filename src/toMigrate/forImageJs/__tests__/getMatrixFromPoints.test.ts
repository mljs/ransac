import { getMatrixFromPoints } from '../getMatrixFromPoints';

test('4 points forming square', () => {
  const side = 3;
  const points = [
    { row: 0, column: 0 },
    { row: side, column: 0 },
    { row: side, column: -side },
    { row: 0, column: -side },
  ];

  const result = getMatrixFromPoints(points);

  expect(result.to2DArray()).toStrictEqual([
    [0, 0, -3, -3],
    [0, 3, 3, 0],
    [0, 0, 0, 0],
  ]);
});
