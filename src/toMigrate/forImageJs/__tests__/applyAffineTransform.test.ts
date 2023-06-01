import { createRigidTransformModel } from '../../../rigidTransform/createRigidTransformModel';
import { applyRigidTransfom } from '../applyAffineTransform';

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

  const model = createRigidTransformModel([180, 0, 4]);
  const result = applyRigidTransfom(source, model);

  expect(result).toBeDeepCloseTo(expected);
});
