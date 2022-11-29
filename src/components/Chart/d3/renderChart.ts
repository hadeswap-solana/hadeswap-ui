import { max, min, scaleLinear, select } from 'd3';

import { Point } from '../types';
import { MARGIN } from '../constants';
import { drawAxes } from './drawAxes';
import { drawPoints } from './drawPoints';
import { drawLinePath } from './drawLinePath';
import styles from '../Chart.module.scss';

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
    const INNER_WIDTH = canvasSize.x - MARGIN.LEFT - MARGIN.RIGHT - 20;
    const INNER_HEIGHT = canvasSize.y - MARGIN.TOP - MARGIN.BOTTOM - 20;

    const xScale = scaleLinear()
      .domain([0, points.length - 1])
      .range([0, INNER_WIDTH]);

    const yScale = scaleLinear()
      .domain([
        // min(points, ({ price }) =>
        //   Math.ceil(price) % 2 ? Math.floor(price) : Math.floor(price) + 1,
        // ),
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
        drawAxes(g, { xScale, yScale, points });
        drawLinePath(g, { xScale, yScale, points });
        drawPoints(g, { points, xScale, yScale });
      })
      .append('text')
      .attr('x', INNER_WIDTH / 2)
      .attr('y', 0 - MARGIN.TOP / 2)
      .attr('text-anchor', 'middle')
      .text('price graph');
  };
