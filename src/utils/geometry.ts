import { line } from './linearRegression';

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

export function getPerpendicularThroughPoint(line: Line, point: Point): Line {
  if ('x' in line) {
    return { slope: 0, offset: point.y };
  } else if (line.slope === 0) {
    return { x: point.x };
  } else {
    return { slope: -1 / line.slope, offset: point.y + point.x / line.slope };
  }
}

export function getIntersectionPoint(line1: Line, line2: Line): Point {
  if ('x' in line1 && 'x' in line2) {
    return { slope: 0, offset: point.y };
  } else {
    return {
      x: (line2.offset - line1.offset) / (line1.slope - line2.slope),
      y:
        (line1.offset - (line1.slope / line2.slope) * line2.offset) /
        (1 - line1.slope / line2.slope),
    };
  }
}

export function getPointLineDistance(point: Point, line: Line): number {}
ﬁ;
