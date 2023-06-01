import Matrix, { SingularValueDecomposition, determinant } from 'ml-matrix';

import { Point, getMatrixFromPoints } from '../forImageJs/getMatrixFromPoints';

import { getCentroid } from './getCentroid';

export interface AffineTransform {
  /**
   * Translation of source points along x and y axes.
   */
  translation: { x: number; y: number };
  /**
   * Clockwise angle in degrees.
   */
  rotation: number;
}

/**
 * Get best rotation and translation of source points to destination points.
 * Based on {@link https://nghiaho.com/?page_id=671}
 *
 * @param source - Source points as a 3xN matrix. Third dimension must be padded with zeros.
 * @param destination - Destination points as a 3xN matrix. Third dimension must be padded with zeros.
 * @returns The affine transformation.
 */
export function getAffineTransform(
  source: Matrix,
  destination: Matrix,
): AffineTransform {
  const sourceCentroid = getCentroid(source);
  const destinationCentroid = getCentroid(destination);

  const translatedSource = source.subColumnVector(sourceCentroid);
  const translatedDestination =
    destination.subColumnVector(destinationCentroid);

  // console.log({ translatedSource, translatedDestination });

  // should be 3x3
  const covarianceMatrix = translatedSource.mmul(
    translatedDestination.transpose(),
  );

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

  const translation = destinationCentroid.subtract(
    rotation.mmul(sourceCentroid),
  );

  let angleDegrees =
    (Math.atan2(rotation.get(1, 0), rotation.get(0, 0)) * 180) / Math.PI;

  if (angleDegrees === -180) {
    angleDegrees = 180;
  }

  return {
    translation: {
      x: translation.get(0, 0),
      y: translation.get(1, 0),
    },
    rotation: angleDegrees,
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
  const sourceMatrix = getMatrixFromPoints(source);
  const destinationMatrix = getMatrixFromPoints(destination);
  const result = getAffineTransform(sourceMatrix, destinationMatrix);
  return [result.rotation, result.translation.x, result.translation.y];
}
