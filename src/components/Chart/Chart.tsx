import { useLayoutEffect, useRef, useState, FC, useEffect } from 'react';
import { throttle } from 'lodash';

import RadioButtonChart from './components/RadioButtonChart';
import { renderChart } from './d3/renderChart';
import useD3 from './hooks/useD3';
import { Point } from './types';
import { chartID } from './constants';
import styles from './Chart.module.scss';
interface ChartProps {
  title?: string;
  className?: string;
  data: Point[] | null;
}

const Chart: FC<ChartProps> = ({ title, className, data }) => {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useLayoutEffect(() => {
    setContainerWidth(containerRef.current?.clientWidth);
  }, []);

  useEffect(() => {
    const handleResize = throttle(() => {
      setContainerWidth(containerRef.current?.clientWidth);
    }, 200);

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const svgRef = useD3(
    renderChart(data, {
      canvasSize: { x: containerWidth, y: 320 },
    }),
    [data, containerWidth],
  );

  return (
    <div
      id={chartID}
      ref={containerRef}
      className={`${styles.root} ${className || ''}`}
    >
      {!!title && <p className={styles.title}>{title}</p>}
      {title === 'swap history' && <RadioButtonChart />}
      <svg ref={svgRef} preserveAspectRatio="xMinYMin meet" />
    </div>
  );
};

export default Chart;
