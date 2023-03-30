import { levenbergMarquardt } from 'ml-levenberg-marquardt';

export function line([a, b]: number[]) {
  return (x: number) => a * x + b;
}

export function linearRegression(
  source: number[],
  destination: number[],
): number[] {
  return levenbergMarquardt(
    { x: source as number[], y: destination as number[] },
    line,
  ).parameterValues;
}
