export interface NotVerticalLine {
  slope: number;
  offset: number;
}

export interface VerticalLine {
  x: number;
}

export type Line = NotVerticalLine | VerticalLine;

export interface Point {
  x: number;
  y: number;
}

/**
 * Line perpendicular to the given line and going through the point.
 * @param line Initial line.
 * @param point Point to go through.
 * @returns Perpendicular lien.
 */
export function getPerpendicularThroughPoint(line: Line, point: Point): Line {
  if ('x' in line) {
    return { slope: 0, offset: point.y };
  } else if (line.slope === 0) {
    return { x: point.x };
  } else {
    return { slope: -1 / line.slope, offset: point.y + point.x / line.slope };
  }
}

function intersectionOneVertical(
  vertical: VerticalLine,
  notVertical: NotVerticalLine,
): Point {
  return {
    x: vertical.x,
    y: notVertical.slope * vertical.x + notVertical.offset,
  };
}

export function getIntersectionPoint(line1: Line, line2: Line): Point {
  if ('x' in line1 && 'x' in line2) {
    throw new Error('The lines are parallel.');
  } else if ('x' in line1) {
    return intersectionOneVertical(line1, line2 as NotVerticalLine); // is there a bug?
  } else if ('x' in line2) {
    return intersectionOneVertical(line2, line1);
  } else {
    return {
      x: (line2.offset - line1.offset) / (line1.slope - line2.slope),
      y:
        (line1.offset - (line1.slope / line2.slope) * line2.offset) /
        (1 - line1.slope / line2.slope),
    };
  }
}

export function getEuclidianDistance(point1: Point, point2: Point): number {
  return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
}

export function getPointLineDistance(point: Point, line: Line): number {
  const perpendicular = getPerpendicularThroughPoint(line, point);
  console.log(perpendicular);
  const intersection = getIntersectionPoint(line, perpendicular);
  console.log(intersection);

  return getEuclidianDistance(point, intersection);
}
