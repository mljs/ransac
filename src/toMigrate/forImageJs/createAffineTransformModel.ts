import { Point } from 'image-js';

import { ModelFunction } from '../..';

/**
 * Generate a function that applies the given transformation parameters to a point.
 *
 * @param transform - Transformation to apply.
 * @returns Transformed point.
 */
export function createAffineTransformModel(
  transform: number[],
): ModelFunction<Point> {
  return (point: Point) => {
    const angle = (transform[0] * Math.PI) / 180;
    const xTranslation = transform[1];
    const yTranslation = transform[2];
    const scale = transform[3];
    const column =
      scale * (Math.cos(angle) * point.column - Math.sin(angle) * point.row) +
      xTranslation;
    const row =
      scale * (Math.sin(angle) * point.column + Math.cos(angle) * point.row) +
      yTranslation;

    return { column, row };
  };
}
