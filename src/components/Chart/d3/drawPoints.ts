import { ScaleLinear, select } from 'd3';

import { Point } from '../types';

type DrawPoints = (
  selection: ReturnType<typeof select>,
  data: {
    points: Point[];
    xScale: ScaleLinear<number, number, never>;
    yScale: ScaleLinear<number, number, never>;
  },
) => void;

export const drawPoints: DrawPoints = (
  selection,
  { points, xScale, yScale },
) => {
  const pointsGroup = selection.append('g');

  pointsGroup
    .selectAll('myCircles')
    .data(points)
    .enter()
    .append('circle')
    .classed('point-buy', ({ type }) => type === 'buy')
    .classed('point-sell', ({ type }) => type === 'sell')
    .attr('cx', (_, idx) => xScale(idx))
    .attr('cy', (d) => yScale(d.price))
    .attr('r', 6);
};
