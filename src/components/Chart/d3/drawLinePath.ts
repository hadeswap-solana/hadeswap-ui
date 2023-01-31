import { area, line, select, ScaleLinear, curveCardinal } from 'd3';
import { Point } from '../types';

const GRADIENT_ID = 'svg-gradient';

type DrawLinePath = (
  selection: ReturnType<typeof select>,
  data: {
    points: Point[];
    xScale: ScaleLinear<number, number, never>;
    yScale: ScaleLinear<number, number, never>;
  },
) => void;

export const drawLinePath: DrawLinePath = (
  selection,
  { xScale, yScale, points },
) => {
  selection.append('defs').call((selection) =>
    createGradient(selection, {
      gradientId: GRADIENT_ID,
    }),
  );

  const areaGenerator = area<Point>()
    .curve(curveCardinal)
    .x((point) => xScale(point.order))
    .y((point) => yScale(point.price))
    .y1(yScale(0));

  selection
    .append('path')
    .attr('d', () => areaGenerator(points))
    .attr('fill', `url(#${GRADIENT_ID})`);

  const lineGenerator = line<Point>()
    .curve(curveCardinal)
    .x((point) => xScale(point.order))
    .y((point) => yScale(point.price));

  selection
    .append('path')
    .classed('chart-path', true)
    .attr('d', () => lineGenerator(points));
};

type CreateGradient = (
  selection: ReturnType<typeof select>,
  data: {
    gradientId: string;
  },
) => void;

const createGradient: CreateGradient = (selection, { gradientId }) => {
  const bgGradient = selection
    .append('linearGradient')
    .attr('id', gradientId)
    .classed('linear-gradient', true)
    .attr('gradientTransform', 'rotate(90)');

  bgGradient.append('stop').attr('offset', '0%');
  bgGradient.append('stop').attr('offset', '100%');
};
