import { Point } from './getMatrixFromPoints';

/**
 * Compute the centroid of a set of points.
 *
 * @param points - Points to process.
 * @returns The centroid.
 */
export function getCentroid(points: Point[]): Point {
  let rowSum = 0;
  let columnSum = 0;

  for (let point of points) {
    rowSum += point.row;
    columnSum += point.column;
  }
  const nbPoints = points.length;

  return { row: rowSum / nbPoints, column: columnSum / nbPoints };
}
