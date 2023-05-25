import { Point } from './getMatrixFromPoints';
import { RigidTransform } from './getRigidTransform';

/**
 * Apply a rotation and a translation to a set of points.
 *
 * @param points - Points to process.
 * @param transform - Transformation to apply.
 * @returns Transformed points.
 */
export function applyRigidTransform(
  points: Point[],
  transform: RigidTransform,
): Point[] {
  let result: Point[] = [];
  for (let point of points) {
    const column =
      Math.cos(transform.angle) * point.column -
      Math.sin(transform.angle) * point.row +
      transform.xTranslation;
    const row =
      Math.sin(transform.angle) * point.column +
      Math.cos(transform.angle) * point.row +
      transform.yTranslation;

    result.push({ row, column });
  }

  return result;
}
