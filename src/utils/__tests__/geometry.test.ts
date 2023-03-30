import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';
expect.extend({ toMatchCloseTo });

import {
  getIntersectionPoint,
  getPerpendicularThroughPoint,
  Line,
  Point,
} from '../geometry';

describe('getPerpendicularThroughPoint', () => {
  it('horizontal line', () => {
    const line: Line = { slope: 0, offset: 0 };
    const point: Point = { x: 0, y: 0 };
    expect(getPerpendicularThroughPoint(line, point)).toStrictEqual({ x: 0 });
  });
  it('vertical line', () => {
    const line: Line = { slope: 0, offset: 0 };
    const point: Point = { x: 0, y: 0 };
    expect(getPerpendicularThroughPoint(line, point)).toStrictEqual({ x: 0 });
  });
  it('45° line', () => {
    const line: Line = { slope: 1, offset: 1 };
    const point: Point = { x: -1, y: 3 };
    expect(getPerpendicularThroughPoint(line, point)).toStrictEqual({
      slope: -1,
      offset: 2,
    });
  });
  it('other line', () => {
    const line: Line = { slope: 1 / 2, offset: -1 };
    const point: Point = { x: 3, y: -2 };
    expect(getPerpendicularThroughPoint(line, point)).toStrictEqual({
      slope: -2,
      offset: 4,
    });
  });
});

describe('getIntersectionPoint', () => {
  it('horizontal and vertical line', () => {
    const line1: Line = { slope: 0, offset: 0 };
    const line2: Line = { x: 0 };
    expect(getIntersectionPoint(line1, line2)).toStrictEqual({ x: 0, y: 0 });
  });
  it('two vertical lines', () => {
    const line1: Line = { x: 1 };
    const line2: Line = { x: 0 };
    expect(() => getIntersectionPoint(line1, line2)).toThrow(
      'The lines are parallel.',
    );
  });
  it('one vertical line', () => {
    const line1: Line = { slope: -1, offset: 7 };
    const line2: Line = { x: 5 };
    expect(getIntersectionPoint(line1, line2)).toStrictEqual({ x: 5, y: 2 });
  });
  it('two not vertical lines', () => {
    const line1: Line = { slope: 1, offset: -1 };
    const line2: Line = { slope: -3, offset: 7 };
    expect(getIntersectionPoint(line1, line2)).toMatchCloseTo({ x: 2, y: 1 });
  });
  it('two other not vertical lines', () => {
    const line1: Line = { slope: 1, offset: 2 };
    const line2: Line = { slope: -1, offset: 2 };
    expect(getIntersectionPoint(line1, line2)).toStrictEqual({ x: 0, y: 2 });
  });
  it('should be symmetrical', () => {
    const line1: Line = { slope: 1, offset: -1 };
    const line2: Line = { slope: -3, offset: 7 };
    expect(getIntersectionPoint(line1, line2)).toMatchCloseTo(
      getIntersectionPoint(line2, line1),
    );
  });
});
