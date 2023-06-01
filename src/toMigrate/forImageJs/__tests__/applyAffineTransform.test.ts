import { applyAffineTransfom } from '../applyAffineTransform';
import { createAffineTransformModel } from '../createAffineTransformModel';

test('6 points aligned', () => {
  const source = [
    { row: 2, column: 2 },
    { row: 3, column: 2 },
    { row: 4, column: 2 },
    { row: 5, column: 2 },
    { row: 6, column: 2 },
    { row: 7, column: 2 },
  ];
  const expected = [
    { row: 2, column: -2 },
    { row: 1, column: -2 },
    { row: 0, column: -2 },
    { row: -1, column: -2 },
    { row: -2, column: -2 },
    { row: -3, column: -2 },
  ];

  const model = createAffineTransformModel([180, 0, 4]);
  const result = applyAffineTransfom(source, model);

  expect(result).toBeDeepCloseTo(expected);
});
