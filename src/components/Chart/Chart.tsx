import {
  useLayoutEffect,
  useRef,
  useState,
  FC,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';
import { throttle } from 'lodash';

import RadioButtonChart from './components/RadioButtonChart';
import useD3 from './hooks/useD3';
import { renderChart } from './d3/renderChart';
import { Point } from './types';
import { chartIDs } from './constants';
import styles from './Chart.module.scss';

interface ChartProps {
  title?: string;
  className?: string;
  data: Point[] | null;
  chartID: string;
  currentPeriod?: string;
  setCurrentPeriod?: Dispatch<SetStateAction<string>>;
}

const Chart: FC<ChartProps> = ({
  title,
  className,
  data,
  chartID,
  currentPeriod,
  setCurrentPeriod,
}) => {
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
      chartID,
    }),
    [data, containerWidth],
  );

  return (
    <div className={styles.chartFrame}>
      <div
        id={chartID}
        ref={containerRef}
        className={`${styles.root} ${className || ''}`}
      >
        {!!title && <p className={styles.title}>{title}</p>}
        {chartID === chartIDs.swapHistory && (
          <RadioButtonChart
            currentPeriod={currentPeriod}
            setCurrentPeriod={setCurrentPeriod}
          />
        )}
        {!data.length ? (
          <div className={styles.noData}>
            <span>there is no activity yet</span>
          </div>
        ) : (
          <svg ref={svgRef} preserveAspectRatio="xMinYMin meet" />
        )}
      </div>
    </div>
  );
};

export default Chart;
