import { useLayoutEffect, useRef, useState, FC, useEffect } from 'react';

import { renderChart } from './d3/renderChart';
import { data as mockData } from './mockData';
import styles from './Chart.module.scss';
import { useD3 } from './hooks';

interface ChartProps {
  className?: string;
  history: any[];
}

const SwapHistoryChart: FC<ChartProps> = ({ className, history }) => {
  // const data = mockData;

  const data = [...history].map((item: any) => {
    // const time = Date.parse(item.timestamp);

    return {
      price: item.solAmount,
      type: item.orderType,
      order: Date.parse(item.timestamp),
    };
  });

  // console.log(data, 'datadatadatadatadata');

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

export default SwapHistoryChart;
