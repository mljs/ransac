import { toMatchCloseTo } from 'jest-matcher-deep-close-to';

import { mad } from '../mad';

expect.extend({ toMatchCloseTo });

it('basic test', () => {
  const data = [0, 1, -2, 1, -1, 2, 4, 0, 1];

  const result = mad(data);

  expect(result).toBe(1);
});

it('even number of values', () => {
  const data = [1, 0, -1, 2, 0, 1, -2, 0];

  const result = mad(data);

  expect(result).toBe(1);
});
