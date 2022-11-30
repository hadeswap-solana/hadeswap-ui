import { axisBottom, axisLeft, select, ScaleLinear } from 'd3';
import { Point } from '../types';

type DrawAxes = (
  selection: ReturnType<typeof select>,
  data: {
    points: Point[];
    xScale: ScaleLinear<number, number, never>;
    yScale: ScaleLinear<number, number, never>;
  },
) => void;

export const drawAxes: DrawAxes = (selection, { xScale, yScale, points }) => {
  const [, INNER_WIDTH] = xScale.range();
  const [INNER_HEIGHT] = yScale.range();

  // xAxis function init
  const xAxis = axisBottom(xScale)
    .tickSize(-INNER_HEIGHT)
    .tickPadding(12)
    .ticks(points.length - 1)
    .tickFormat((_, idx) => `${points?.[idx]?.order}`);

  // Draw x axis group
  const xAxisGroup = selection
    .append('g')
    .classed('xAxis', true)
    .call(xAxis)
    .attr('transform', `translate(0, ${INNER_HEIGHT})`);

  // Remove vertical ticks
  xAxisGroup.selectAll('.tick line').remove();
  // Remove domain box
  xAxisGroup.selectAll('.domain').remove();

  // yAxis function init
  const yAxis = axisLeft(yScale).tickSize(-INNER_WIDTH).tickPadding(12);

  // Draw y axis group
  const yAxisGroup = selection.append('g').classed('yAxis', true).call(yAxis);
  yAxisGroup.selectAll('.domain').remove();
};
