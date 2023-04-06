import { toMatchCloseTo } from 'jest-matcher-deep-close-to';

import { linearRegression } from '../linearRegression';

expect.extend({ toMatchCloseTo });

it('three points aligned', () => {
  const source = [0, 1, 2];
  const destination = [0, 1, 2];

  const result = linearRegression(source, destination);

  expect(result).toMatchCloseTo([1, 0]);
});

it('horizontal line', () => {
  const source = [0, 1, 2, 3, 4];
  const destination = [0, 0, 0, 0, 0];

  const result = linearRegression(source, destination);

  expect(result).toStrictEqual([0, 0]);
});
