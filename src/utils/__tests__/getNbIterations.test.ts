import { toMatchCloseTo } from 'jest-matcher-deep-close-to';

import { getNbIterations } from '../getNbIterations';

expect.extend({ toMatchCloseTo });

it('50% outliers', () => {
  expect(getNbIterations(0.99, 0.5, 2)).toBe(17);
});

it('10% outliers', () => {
  expect(getNbIterations(0.99, 0.1, 2)).toBe(3);
});

it('50% probability', () => {
  expect(getNbIterations(0.5, 0.6, 2)).toBe(4);
});
