import { getCentroid } from '../getCentroid';

test('two points', () => {
  const points = [
    { row: 2, column: 4 },
    { row: 10, column: 2 },
  ];

  expect(getCentroid(points)).toStrictEqual({ row: 6, column: 3 });
});
