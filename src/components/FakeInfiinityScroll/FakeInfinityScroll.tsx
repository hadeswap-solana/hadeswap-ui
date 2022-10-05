import { FC, useCallback, useEffect, useState } from 'react';
import { useDebounce, useIntersection } from '../../hooks';

interface FakeInfinityScrollProps {
  className?: string;
  children: JSX.Element[];
  emptyMessage?: string;
  itemsPerScroll?: number;
  emptyMessageClassName?: string;
}

export const FakeInfinityScroll: FC<FakeInfinityScrollProps> = ({
  className,
  children,
  itemsPerScroll = 10,
  emptyMessage = 'No items found',
  emptyMessageClassName,
}) => {
  if (!children.length) {
    return <div className={emptyMessageClassName}>{emptyMessage}</div>;
  }

  const [itemsToShow, setItemsToShow] = useState<number>(itemsPerScroll);

  const { ref, inView } = useIntersection();

  const next = useCallback(() => {
    setItemsToShow((prev) => prev + itemsPerScroll);
  }, [itemsPerScroll]);

  const nextDebounced = useDebounce(next, 500);

  useEffect(() => {
    if (inView && children.length > itemsToShow) {
      nextDebounced();
    }
  }, [inView, nextDebounced, children.length, itemsToShow]);

  return (
    <div className={className}>
      {children?.slice(0, itemsToShow).map((child) => child)}
      <div ref={ref} />
    </div>
  );
};
