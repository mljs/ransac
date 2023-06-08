import Matrix from 'ml-matrix';

import { getMatrixFromPoints } from '../../forImageJs/getMatrixFromPoints';
import { getAffineTransform } from '../getAffineTransform';

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

  const sourceMatrix = getMatrixFromPoints(source);
  const destinationMatrix = getMatrixFromPoints(destination);

  const result = getAffineTransform(sourceMatrix, destinationMatrix);

  expect(result).toBeDeepCloseTo({
    translation: { x: 0, y: 0 },
    rotation: -90,
    scale: 1,
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

  const sourceMatrix = getMatrixFromPoints(source);
  const destinationMatrix = getMatrixFromPoints(destination);

  const result = getAffineTransform(sourceMatrix, destinationMatrix);

  expect(result).toBeDeepCloseTo({
    rotation: 180,
    translation: { x: 0, y: 4 },
    scale: 1,
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

  const sourceMatrix = getMatrixFromPoints(source);
  const destinationMatrix = getMatrixFromPoints(destination);

  const result = getAffineTransform(sourceMatrix, destinationMatrix);

  expect(result).toBeDeepCloseTo({
    rotation: -135,
    translation: { x: 0, y: 0 },
    scale: 1,
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

  const sourceMatrix = getMatrixFromPoints(source);
  const destinationMatrix = getMatrixFromPoints(destination);

  const result = getAffineTransform(sourceMatrix, destinationMatrix);

  expect(result).toBeDeepCloseTo({
    rotation: 45,
    translation: { x: 0, y: 0 },
    scale: 1,
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
  const sourceMatrix = getMatrixFromPoints(source);
  const destinationMatrix = getMatrixFromPoints(destination);

  const result = getAffineTransform(sourceMatrix, destinationMatrix);

  expect(result).toBeDeepCloseTo({
    rotation: 180,
    translation: { x: 9, y: 2 },
    scale: 1,
  });
});

test('rectangle only rotated', () => {
  const source = new Matrix([
    [1, 5, 5, 1],
    [-4, -4, -2, -2],
    [1, 1, 1, 1],
  ]);
  const destination = new Matrix([
    [-4, -4, -2, -2],
    [-1, -5, -5, -1],
    [1, 1, 1, 1],
  ]);
  const result = getAffineTransform(source, destination);

  expect(result).toBeDeepCloseTo({
    translation: { x: 0, y: 0 },
    scale: 1,
    rotation: -90,
  });
});

test('rectangle with translation', () => {
  const source = new Matrix([
    [1, 5, 5, 1],
    [-4, -4, -2, -2],
    [1, 1, 1, 1],
  ]);
  const destination = new Matrix([
    [-5, -5, -3, -3],
    [8, 4, 4, 8],
    [1, 1, 1, 1],
  ]);
  const result = getAffineTransform(source, destination);
  expect(result).toBeDeepCloseTo({
    translation: { x: -1, y: 9 },
    scale: 1,
    rotation: -90,
  });
});

describe('scale different from 1', () => {
  it('triangle with a scale of 2', () => {
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

    const sourceMatrix = getMatrixFromPoints(source);
    const destinationMatrix = getMatrixFromPoints(destination);

    const result = getAffineTransform(sourceMatrix, destinationMatrix);

    expect(result).toBeDeepCloseTo({
      translation: { x: 0, y: 0 },
      scale: 2,
      rotation: -90,
    });
  });

  it('rectangle with a scale of 2', () => {
    const source = new Matrix([
      [1, 5, 5, 1],
      [-4, -4, -2, -2],
      [1, 1, 1, 1],
    ]);
    const destination = new Matrix([
      [-6, -6, -2, -2],
      [10, 2, 2, 10],
      [1, 1, 1, 1],
    ]);
    const result = getAffineTransform(source, destination);

    expect(result).toBeDeepCloseTo({
      translation: { x: 2, y: 12 },
      scale: 2,
      rotation: -90,
    });
  });

  it('scale = 0.5', () => {
    const source = new Matrix([
      [1, 5, 5, 1],
      [-4, -4, -2, -2],
      [1, 1, 1, 1],
    ]);
    const destination = new Matrix([
      [0.5, 2.5, 2.5, 0.5],
      [-2, -2, -1, -1],
      [1, 1, 1, 1],
    ]);
    const result = getAffineTransform(source, destination);

    expect(result).toBeDeepCloseTo({
      translation: { x: 0, y: 0 },
      scale: 0.5,
      rotation: 0,
    });
  });
});
