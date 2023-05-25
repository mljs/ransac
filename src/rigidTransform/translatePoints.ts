import { Point } from './getMatrixFromPoints';

/**
 * Translate the points by the translation vector.
 *
 * @param points - Points to translate
 * @param translation - Translation vector.
 * @returns Translated points.
 */
export function addVector(points: Point[], translation: Point): Point[] {
  let result: Point[] = [];
  for (let point of points) {
    result.push({
      row: point.row + translation.row,
      column: point.column + translation.column,
    });
  }
  return result;
}

/**
 * Subtract the vector from the points.
 *
 * @param points - Points to translate
 * @param translation - Translation vector.
 * @returns Translated points.
 */
export function subtractVector(points: Point[], translation: Point): Point[] {
  let result: Point[] = [];
  for (let point of points) {
    result.push({
      row: point.row - translation.row,
      column: point.column - translation.column,
    });
  }
  return result;
}
