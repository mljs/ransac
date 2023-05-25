import { getRigidTransform } from '../getRigidTransform';

test('3 points', () => {
  const source = [
    { row: 2, column: 1 },
    { row: -1, column: 1 },
    { row: -1, column: -3 },
  ];
  const destination = [
    { row: -1, column: 2 },
    { row: -1, column: -1 },
    { row: 3, column: -1 },
  ];

  const result = getRigidTransform(source, destination);

  expect(result).toBeDeepCloseTo({
    xTranslation: 1 / 3,
    yTranslation: 1 / 3,
    angle: -90,
  });
});

test('6 points on a line', () => {
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

  const result = getRigidTransform(source, destination);

  expect(result).toBeDeepCloseTo({
    xTranslation: -4,
    yTranslation: -5,
    angle: 180,
  });
});

test('square', () => {
  const side = 3;

  const source = [
    { row: 0, column: 0 },
    { row: side, column: 0 },
    { row: side, column: -side },
    { row: 0, column: -side },
  ];
  const diagonal = side * Math.sqrt(2);

  const destination = [
    { row: 0, column: 0 },
    { row: -diagonal / 2, column: diagonal / 2 },
    { row: 0, column: diagonal },
    { row: diagonal / 2, column: diagonal / 2 },
  ];

  const result = getRigidTransform(source, destination);
  console.log(result);

  expect(result).toBeDeepCloseTo({
    xTranslation: (side + diagonal) / 2,
    yTranslation: -side / 2,
    angle: -135,
  });
});
