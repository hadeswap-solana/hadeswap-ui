import { ScaleLinear, select } from 'd3';
import { chartID } from '../constants';

import { Point } from '../types';

type DrawPoints = (
  selection: ReturnType<typeof select>,
  data: {
    points: Point[];
    xScale: ScaleLinear<number, number, never>;
    yScale: ScaleLinear<number, number, never>;
    width: number;
  },
) => void;

export const drawPoints: DrawPoints = (
  selection,
  { points, xScale, yScale, width },
) => {
  const mouseover = (e: MouseEvent, d: Point) => {
    const getNumberWithOrdinal = (n: number): string => {
      return (
        n + (['st', 'nd', 'rd'][((((n + 90) % 100) - 10) % 10) - 1] || 'th')
      );
    };

    const tooltip = select(`#${chartID}`)
      .append('div')
      .classed('tooltipPoint', true)
      .style('top', `${yScale(d.price) - 20}px`)
      .style('left', `${e.x > width - 100 ? e.x - 175 : e.x - 25}px`);
    tooltip
      .append('div')
      .classed('orderNumber', true)
      .text(`${getNumberWithOrdinal(d.order)} NFT`);

    const price = tooltip.append('div').classed('price', true);
    price
      .append('svg')
      .classed('point-buy', d.type === 'buy')
      .classed('point-sell', d.type === 'sell')
      .append('circle')
      .attr('r', 5)
      .attr('cx', 6)
      .attr('cy', 7)
      .attr('stroke', 'none');
    price.append('span').classed('priceTitle', true).text(`price:`);
    price
      .append('span')
      .classed('priceValue', true)
      .text(`${d.price.toFixed(2)}`);
  };

  const pointsGroup = selection.append('g');

  pointsGroup
    .selectAll('myCircles')
    .data(points)
    .enter()
    .append('circle')
    .classed('point-buy', ({ type }) => type === 'buy')
    .classed('point-sell', ({ type }) => type === 'sell')
    .classed('point-empty', ({ type }) => type === 'empty')
    .attr('cx', (_, idx) => xScale(idx))
    .attr('cy', (d) => yScale(d.price))
    .attr('r', 6)
    .style('cursor', 'pointer')
    .on('mouseover', mouseover)
    .on('mouseout', () => select('.tooltipPoint').remove());
};
