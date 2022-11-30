import { max, scaleLinear, select } from 'd3';

import { Point } from '../types';
import { MARGIN } from '../constants';
import { drawAxes } from './drawAxes';
import { drawPoints } from './drawPoints';
import { drawLinePath } from './drawLinePath';

type RenderChart = (
  points: Point[],
  params: {
    canvasSize: {
      x: number;
      y: number;
    };
  },
) => (selection: ReturnType<typeof select>) => void;

export const renderChart: RenderChart =
  (points, { canvasSize }) =>
  (selection) => {
    const INNER_WIDTH = canvasSize.x - MARGIN.LEFT - MARGIN.RIGHT;
    const INNER_HEIGHT = canvasSize.y - MARGIN.TOP - MARGIN.BOTTOM;

    const xScale = scaleLinear()
      .domain([0, points.length - 1])
      .range([0, INNER_WIDTH]);

    const yScale = scaleLinear()
      .domain([
        0,
        max(points, ({ price }) =>
          Math.ceil(price) % 2 ? Math.ceil(price) + 1 : Math.ceil(price),
        ),
      ])
      .range([INNER_HEIGHT, 0]);

    const svg = selection
      .attr('width', canvasSize.x)
      .attr('height', canvasSize.y);

    selection.selectAll('g.chart-group').remove();

    svg
      .append('g')
      .classed('chart-group', true)
      .attr('transform', `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)
      .call((g) => {
        drawAxes(g, { xScale, yScale });
        drawLinePath(g, { xScale, yScale, points });
        drawPoints(g, { points, xScale, yScale });
      });
  };
