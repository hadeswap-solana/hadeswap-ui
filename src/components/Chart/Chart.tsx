import { useLayoutEffect, useRef, useState, FC } from 'react';

import { renderChart } from './d3/renderChart';
import { data as mockData } from './mockData';
import styles from './Chart.module.scss';
import { useD3 } from './hooks';

interface ChartProps {
  className?: string;
}

export const Chart: FC<ChartProps> = ({ className }) => {
  const data = mockData;

  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useLayoutEffect(() => {
    setContainerWidth(containerRef.current?.offsetWidth);
  }, []);

  const svgRef = useD3(
    renderChart(data, {
      canvasSize: { x: containerWidth, y: 250 },
    }),
    [data, containerWidth],
  );

  return (
    <div ref={containerRef} className={`${styles.root} ${className || ''}`}>
      <svg ref={svgRef} preserveAspectRatio="xMinYMin meet" />
    </div>
  );
};
