# Finding rotation and translation between two sets of points

Based on the tutorial: https://nghiaho.com/?page_id=671

## Points format

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
