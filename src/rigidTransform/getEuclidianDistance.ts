import { Point } from './getMatrixFromPoints';

/**
 * Compute the sum of distances between points 1 and points 2.
 *
 * @param points1 - First set of points.
 * @param points2 - Second set of points.
 * @returns Sum of all distances.
 */
export function getEuclidianDistance(
  points1: Point[],
  points2: Point[],
): number {
  let totalDistance = 0;
  for (let i = 0; i < points1.length; i++) {
    totalDistance += Math.sqrt(
      (points1[i].row - points2[i].row) ** 2 +
        (points1[i].column - points2[i].column) ** 2,
    );
  }

  return totalDistance;
}
