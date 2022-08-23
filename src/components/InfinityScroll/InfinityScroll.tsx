import InfiniteScrollComponent, {
  Props,
} from 'react-infinite-scroll-component';

import classNames from 'classnames';

interface InfinityScrollProps {
  itemsToShow?: number;
  next: () => void;
  infinityScrollProps?: Omit<
    Props,
    'dataLength' | 'next' | 'hasMore' | 'children'
  >;
  wrapperClassName?: string;
  emptyMessage?: string;
  emptyMessageClassName?: string;
  isLoading?: boolean;
  customLoader?: JSX.Element;
  children: JSX.Element[];
  scrollableTargetId?: string;
}

const InfinityScroll = ({
  itemsToShow = 20,
  next,
  wrapperClassName,
  isLoading = false,
  emptyMessage = 'No items found',
  emptyMessageClassName,
  children,
  infinityScrollProps,
  scrollableTargetId = 'app-content',
  customLoader,
}: InfinityScrollProps): JSX.Element => {
  if (isLoading) {
    return (
      customLoader || (
        <div>
          <p>Loading...</p>
        </div>
      )
    );
  }

  if (!children.length) {
    return (
      <div className={classNames(emptyMessageClassName)}>{emptyMessage}</div>
    );
  }

  return (
    <InfiniteScrollComponent
      scrollableTarget={scrollableTargetId}
      next={next}
      dataLength={itemsToShow}
      hasMore={true}
      loader={false}
      {...infinityScrollProps}
    >
      <div className={classNames(wrapperClassName)}>
        {children?.slice(0, itemsToShow).map((child) => child)}
      </div>
    </InfiniteScrollComponent>
  );
};

export default InfinityScroll;
