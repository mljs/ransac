import { ModelFunction } from '..';

import { Point } from './getMatrixFromPoints';

/**
 * Apply a given transform to a set of points.
 *
 * @param points - Points to process.
 * @param model - The transformation function.
 * @returns The transformed points.
 */
export function applyRigidTransfom(
  points: Point[],
  model: ModelFunction<Point>,
): Point[] {
  let result: Point[] = [];

  for (let point of points) {
    result.push(model(point));
  }

  return result;
}
