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
    xTranslation: 0,
    yTranslation: 0,
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
    angle: 180,
    xTranslation: 0,
    yTranslation: 4,
  });
});

test('square', () => {
  const side = 3;

  const source = [
    { column: 0, row: 0 },
    { column: 0, row: side },
    { column: -side, row: side },
    { column: -side, row: 0 },
  ];
  const diagonal = side * Math.sqrt(2);

  const destination = [
    { column: 0, row: 0 },
    { column: diagonal / 2, row: -diagonal / 2 },
    { column: diagonal, row: 0 },
    { column: diagonal / 2, row: diagonal / 2 },
  ];

  const result = getRigidTransform(source, destination);

  expect(result).toBeDeepCloseTo({
    angle: -135,
    xTranslation: 0,
    yTranslation: 0,
  });
});

test('angle should be 45 degrees', () => {
  const side = 3;

  const source = [
    { column: 0, row: 0 },
    { column: side, row: 0 },
    { column: side, row: side },
    { column: 0, row: side },
  ];
  const diagonal = side * Math.sqrt(2);

  const destination = [
    { column: 0, row: 0 },
    { column: diagonal / 2, row: diagonal / 2 },
    { column: 0, row: diagonal },
    { column: -diagonal / 2, row: diagonal / 2 },
  ];

  const result = getRigidTransform(source, destination);

  expect(result).toBeDeepCloseTo({
    angle: 45,
    xTranslation: 0,
    yTranslation: 0,
  });
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
  const result = getRigidTransform(source, destination);

  expect(result).toBeDeepCloseTo({
    angle: 180,
    xTranslation: 9,
    yTranslation: 2,
  });
});

test('test with a scale of 2', () => {
  // todo: handle scale!
  // angle seems to work if scale is not the same, so we should be able to compute the scale.
  const source = [
    { row: 2, column: 1 },
    { row: -1, column: 1 },
    { row: -1, column: -3 },
  ];
  const destination = [
    { row: -2, column: 4 },
    { row: -2, column: -2 },
    { row: 6, column: -2 },
  ];

  const result = getRigidTransform(source, destination);

  expect(result.angle).toBeCloseTo(-90);
});
