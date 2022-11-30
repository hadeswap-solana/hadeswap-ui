import { axisLeft, select, ScaleLinear } from 'd3';

type DrawAxes = (
  selection: ReturnType<typeof select>,
  data: {
    xScale: ScaleLinear<number, number, never>;
    yScale: ScaleLinear<number, number, never>;
  },
) => void;

export const drawAxes: DrawAxes = (selection, { xScale, yScale }) => {
  const [, INNER_WIDTH] = xScale.range();

  // yAxis function init
  const yAxis = axisLeft(yScale).tickSize(-INNER_WIDTH).tickPadding(12);

  // Draw y axis group
  const yAxisGroup = selection.append('g').classed('yAxis', true).call(yAxis);
  yAxisGroup.selectAll('.domain').remove();
};
