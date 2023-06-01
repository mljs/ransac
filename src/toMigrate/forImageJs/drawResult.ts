import { Point, Image, ImageColorModel } from 'image-js';

/**
 * Draw source, destination and transformed points on an image.
 *
 * @param source - Source points.
 * @param destination - Destination points.
 * @param result - Transformed points.
 * @param imageSide - Dimension of the image. Should be odd integer.
 * @returns The image with the points.
 */
export function drawResult(
  source: Point[],
  destination: Point[],
  result: Point[],
  imageSide = 21,
): Image {
  const center = (imageSide - 1) / 2;
  const image = new Image(imageSide, imageSide, {
    colorModel: ImageColorModel.RGB,
  }).fill([255, 255, 255]);

  // draw coordinates axes
  image.drawLine(
    { row: center, column: 0 },
    { row: center, column: imageSide },
    { out: image },
  );
  image.drawLine(
    { row: 0, column: center },
    { row: imageSide, column: center },
    { out: image },
  );

  // draw points: source (green), destination (blue), result (red)
  image.drawPoints(source, {
    out: image,
    color: [0, 255, 0],
    origin: { row: center, column: center },
  });

  image.drawPoints(destination, {
    out: image,
    color: [0, 0, 255],
    origin: { row: center, column: center },
  });

  image.drawPoints(result, {
    out: image,
    color: [255, 0, 0],
    origin: { row: center, column: center },
  });

  return image;
}
