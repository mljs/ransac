import { Point } from './getCentroid';

/**
 * Translate the points by the translation vector.
 *
 * @param points - Points to translate
 * @param translation - Translation vector.
 * @returns Translated points.
 */
export function translatePoints(points: Point[], translation: Point): Point[] {
  let result: Point[] = [];
  for (let point of points) {
    result.push({
      row: point.row + translation.row,
      column: point.column + translation.column,
    });
  }
  return result;
}
