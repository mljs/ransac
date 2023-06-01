import { getCentroid } from './getCentroid';
import { Point } from '../toMigrate/forImageJs/getMatrixFromPoints';

/**
 * Compute the translation vector to add to source to get to destination.
 *
 * @param source - Source points.
 * @param destination - Destination points.
 * @returns The traslation vector from source to destination.
 */
export function getTranslation(source: Point[], destination: Point[]): Point {
  const sourceCentroid = getCentroid(source);
  const destinationCentroid = getCentroid(destination);

  return {
    row: destinationCentroid.row - sourceCentroid.row,
    column: destinationCentroid.column - sourceCentroid.column,
  };
}
