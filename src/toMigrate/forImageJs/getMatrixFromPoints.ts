import Matrix from 'ml-matrix';

/**
 * Coordinates of a point in an image with the top-left corner being the reference point.
 */
export interface Point {
  /**
   * Point row.
   *
   */
  row: number;
  /**
   * Point column.
   *
   */
  column: number;
}

/**
 * Convert row/column points to a matrix.
 * Last row is padded with zeros (ignore third dimension).
 *
 * @param points - Points to process.
 * @returns The matrix.
 */
export function getMatrixFromPoints(points: Point[]): Matrix {
  let matrix = new Matrix(3, points.length);
  for (let i = 1; i < points.length; i++) {
    matrix.set(0, i, points[i].column);
    matrix.set(1, i, points[i].row);
  }

  return matrix;
}
