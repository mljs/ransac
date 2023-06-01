# Finding rotation and translation between two sets of points

Based on the tutorial: https://nghiaho.com/?page_id=671

## Points format

This is a format specific to `image-js` and should not be in the code to get the affine transform. We'd rather directly use matrices.

```js
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
```

## Steps

1. Find centroids of the two point sets and deduce the translation from one to the other
2. Find rotation using SVD
