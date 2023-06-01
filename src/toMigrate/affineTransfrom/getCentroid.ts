import Matrix from 'ml-matrix';

/**
 * Compute the centroid of a set of points.
 *
 * @param points - Points to process.
 * @returns The centroid.
 */
export function getCentroid(points: Matrix): Matrix {
  let result = new Matrix(3, 1);
  const nbPoints = points.getRow(0).length;
  let xSum = 0;
  let ySum = 0;

  for (let i = 0; i < nbPoints; i++) {
    xSum += points.get(0, i);
    ySum += points.get(1, i);
  }

  result.set(0, 0, xSum / nbPoints);
  result.set(1, 0, ySum / nbPoints);

  return result;
}
