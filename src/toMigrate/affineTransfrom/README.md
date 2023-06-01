# Finding rotation and translation between two sets of points

Based on the tutorial: https://nghiaho.com/?page_id=671

## API

The inputs of the functions are 3xN matrices consisting of the source and the destination points. The third dimension for Z must be padded with zeros. The output is an object containing the x and y translations as well as the angle in degrees.

```ts
export interface AffineTransformParameters {
  rotation: number;
  translation: { x: number; y: number };
}

export function getAffineTransform(
  source: Matrix,
  destination: Matrix,
): AffineTransformParameters;
```

## Main steps of the algorithm

1. Find centroids of the two point sets and deduce the translation from one to the other
2. Find rotation using SVD
