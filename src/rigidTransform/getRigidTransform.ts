import { SingularValueDecomposition } from 'ml-matrix';

import { getCentroid } from './getCentroid';
import { Point, getMatrixFromPoints } from './getMatrixFromPoints';
import { translatePoints } from './translatePoints';

export interface RigidTransform {
  /**
   * Translation of source points along x axis.
   */
  xTranslation: number;
  /**
   * Translation of source points along y axis.
   */
  yTranslation: number;
  /**
   * Clockwise angle in degrees.
   */
  angle: number;
}

/**
 * Get best rotation and translation of source points to destination points.
 *
 * @param source - Source points.
 * @param destination - Destination points.
 * @returns The rigid transformation.
 */
export function getRigidTransform(
  source: Point[],
  destination: Point[],
): RigidTransform {
  const sourceCentroid = getCentroid(source);
  const destinationCentroid = getCentroid(destination);

  const translatedSource = translatePoints(source, sourceCentroid);
  const translatedDestination = translatePoints(
    destination,
    destinationCentroid,
  );

  const srcMatrix = getMatrixFromPoints(translatedSource);
  const dstMatrix = getMatrixFromPoints(translatedDestination);

  // should be 3x3
  const covarianceMatrix = srcMatrix.mmul(dstMatrix.transpose());
  const svd = new SingularValueDecomposition(covarianceMatrix);

  const U = svd.leftSingularVectors;
  const V = svd.rightSingularVectors;

  const rotation = V.mmul(U.transpose());

  return {
    xTranslation: destinationCentroid.column - sourceCentroid.column,
    yTranslation: destinationCentroid.row - sourceCentroid.row,
    angle: (Math.atan2(rotation.get(1, 0), rotation.get(0, 0)) * 180) / Math.PI,
  };
}
