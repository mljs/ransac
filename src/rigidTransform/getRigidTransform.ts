import Matrix, { SingularValueDecomposition, determinant } from 'ml-matrix';

import {
  Point,
  getMatrixFromPoints,
} from '../toMigrate/forImageJs/getMatrixFromPoints';

import { getCentroid } from './getCentroid';
import { subtractVector } from './translatePoints';

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
 * Based on {@link https://nghiaho.com/?page_id=671}
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

  const translatedSource = subtractVector(source, sourceCentroid);
  const translatedDestination = subtractVector(
    destination,
    destinationCentroid,
  );

  const srcMatrix = getMatrixFromPoints(translatedSource);
  const dstMatrix = getMatrixFromPoints(translatedDestination);

  // console.log({ srcMatrix, dstMatrix });

  // should be 3x3
  const covarianceMatrix = srcMatrix.mmul(dstMatrix.transpose());

  const svd = new SingularValueDecomposition(covarianceMatrix);

  const U = svd.leftSingularVectors;
  const V = svd.rightSingularVectors;

  let rotation = V.mmul(U.transpose());

  if (determinant(rotation) === -1) {
    const newSvd = new SingularValueDecomposition(rotation);
    const newU = newSvd.leftSingularVectors;
    const newV = newSvd.rightSingularVectors.mulColumn(2, -1);

    rotation = newV.mmul(newU.transpose());
  }

  const srcCentroidVector = new Matrix([
    [sourceCentroid.column],
    [sourceCentroid.row],
    [0],
  ]);
  const dstCentroidVector = new Matrix([
    [destinationCentroid.column],
    [destinationCentroid.row],
    [0],
  ]);

  const translation = dstCentroidVector.subtract(
    rotation.mmul(srcCentroidVector),
  );

  let angleDegrees =
    (Math.atan2(rotation.get(1, 0), rotation.get(0, 0)) * 180) / Math.PI;

  if (angleDegrees === -180) {
    angleDegrees = 180;
  }

  return {
    xTranslation: translation.get(0, 0),
    yTranslation: translation.get(1, 0),
    angle: angleDegrees,
  };
}

/**
 * Get rigid transform model parameters.
 *
 * @param source - Source points.
 * @param destination - Destination points.
 * @returns The model parameters in the format [angle, xTranslation, yTranslation]
 */
export function getRigidTransformArray(
  source: Point[],
  destination: Point[],
): number[] {
  const result = getRigidTransform(source, destination);
  return [result.angle, result.xTranslation, result.yTranslation];
}
