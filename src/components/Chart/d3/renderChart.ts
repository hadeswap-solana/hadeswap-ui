import { extent, max, scaleLinear, select } from 'd3';

import { Point } from '../types';
import { MARGIN } from '../constants';
import { drawAxes } from './drawAxes';
import { drawLinePath } from './drawLinePath';
import { drawPoints } from './drawPoints';

type RenderChart = (
  points: Point[],
  params: {
    canvasSize: {
      x: number;
      y: number;
    };
    chartID: string;
    currentPeriod: string;
  },
) => (selection: ReturnType<typeof select>) => void;

export const renderChart: RenderChart =
  (points, { canvasSize, chartID, currentPeriod }) =>
  (selection) => {
    const INNER_WIDTH = canvasSize.x - MARGIN.LEFT - MARGIN.RIGHT;
    const INNER_HEIGHT = canvasSize.y - MARGIN.TOP - MARGIN.BOTTOM;

    const xScale = scaleLinear()
      .domain(extent(points, (d) => d.order))
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
        drawAxes(g, { xScale, yScale, chartID, currentPeriod });
        drawLinePath(g, { xScale, yScale, points });
        drawPoints(g, {
          points,
          xScale,
          yScale,
          width: INNER_WIDTH,
          chartID,
        });
      });
  };
