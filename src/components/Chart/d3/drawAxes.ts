import { axisLeft, select, ScaleLinear, axisBottom, timeFormat } from 'd3';
import { chartIDs } from '../constants';

type DrawAxes = (
  selection: ReturnType<typeof select>,
  data: {
    xScale: ScaleLinear<number, number, never>;
    yScale: ScaleLinear<number, number, never>;
    chartID: string;
    currentPeriod: string;
  },
) => void;

export const drawAxes: DrawAxes = (
  selection,
  { xScale, yScale, chartID, currentPeriod },
) => {
  const [, INNER_WIDTH] = xScale.range();
  const [INNER_HEIGHT] = yScale.range();

  // yAxis function init
  const yAxis = axisLeft(yScale).tickSize(-INNER_WIDTH).tickPadding(12);

  // Draw y axis group
  const yAxisGroup = selection.append('g').classed('yAxis', true).call(yAxis);
  yAxisGroup.selectAll('.domain').remove();

  // xAxis function init
  const dateFormat = {
    ['day']: timeFormat('%I %p'),
    ['week']: timeFormat('%a %d'),
  };

  const xAxis = axisBottom(xScale)
    .tickSize(INNER_HEIGHT)
    .tickFormat((d) =>
      chartID === chartIDs.swapHistory
        ? dateFormat[currentPeriod](new Date(+d))
        : `${Math.abs(+d)}`,
    )
    .tickPadding(14);

  // Draw x axis group
  const xAxisGroup = selection.append('g').classed('xAxis', true).call(xAxis);
  xAxisGroup.selectAll('.domain').remove();
  xAxisGroup.selectAll('line').remove();
  xAxisGroup
    .selectAll('.tick')
    .filter((d) => !Number.isInteger(d))
    .remove()
    .remove();
  xAxisGroup
    .selectAll('.tick')
    .filter((d) => d === 0)
    .remove();
};
