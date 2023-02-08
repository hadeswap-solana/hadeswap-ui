import { select } from 'd3';
import { RefObject, useEffect, useRef } from 'react';

const useD3 = <T extends SVGSVGElement = SVGSVGElement>(
  renderChartFn: (selection: ReturnType<typeof select>) => void,
  dependencies: Array<any>,
): RefObject<T> => {
  const ref = useRef(null);

  useEffect(() => {
    renderChartFn(select(ref.current) as ReturnType<typeof select>);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return ref;
};

export default useD3;
