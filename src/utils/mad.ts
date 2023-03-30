import arrayMedian from 'ml-array-median';

/** Median absolute deviation from a set of points to a model.
 * Aka the median distance from the points to the model. If the number of points is even,
 * a linear interpolation is made between the two middle values.
 *
 */
export function mad(data: number[]): number {
  const median = arrayMedian(data);
  const diff = data.map((value) => Math.abs(value - median));
  return arrayMedian(diff);
}
