import { useLayoutEffect, useRef, useState, FC } from 'react';

import { renderChart } from './d3/renderChart';
import styles from './Chart.module.scss';
import { useD3 } from './hooks';
import { Point } from './types';

interface ChartProps {
  isCreate?: boolean;
  title?: string;
  className?: string;
  data: Point[] | null;
}

export const Chart: FC<ChartProps> = ({ title, className, data }) => {
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
      {!!title && <p className={styles.title}>{title}</p>}
      <svg ref={svgRef} preserveAspectRatio="xMinYMin meet" />
    </div>
  );
};
