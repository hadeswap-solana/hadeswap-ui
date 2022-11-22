import { FC, useEffect, useState, memo } from 'react';
import { useParams } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import ItemsList from '../../../../components/ItemsList';
import { Spinner } from '../../../../components/Spinner/Spinner';
import { useIntersection } from '../../../../hooks';
import { ACTIVITY, PubKeys } from '../../../../constants/common';
import { NftActivityData } from '../../../../state/core/types';

import styles from './styles.module.scss';

const useActivityData = (marketPublicKey: string) => {
  const LIMIT = 3;

  const [isListEnded, setIsListEnded] = useState<boolean>(false);

  const fetchData = async ({
    pageParam,
    marketPublicKey,
  }: {
    pageParam: number;
    marketPublicKey: string;
  }) => {
    const data: NftActivityData[] = await (
      await fetch(
        `https://${
          process.env.BACKEND_DOMAIN
        }/trades/${marketPublicKey}?sortBy=timestamp&sort=desc&limit=${LIMIT}&skip=${
          LIMIT * pageParam
        }`,
      )
    ).json();

    if (!data?.length) {
      setIsListEnded(true);
    }

    return {
      pageParam,
      data,
    };
  };

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ['marketActivity', marketPublicKey],
    ({ pageParam = 0 }) => fetchData({ marketPublicKey, pageParam }),
    {
      enabled: !!marketPublicKey,
      getPreviousPageParam: (firstPage) => {
        return firstPage.pageParam - 1 ?? undefined;
      },
      getNextPageParam: (lastPage) => {
        return lastPage.data?.length ? lastPage.pageParam + 1 : undefined;
      },
      cacheTime: 100_000,
      networkMode: 'offlineFirst',
    },
  );

  return {
    data,
    fetchNextPage,
    isFetchingNextPage,
    isListEnded,
  };
};

export const CollectionActivityTab: FC = memo(() => {
  const { ref, inView } = useIntersection();

  const { publicKey: marketPublicKey } = useParams<{ publicKey: string }>();

  const { data, fetchNextPage, isFetchingNextPage, isListEnded } =
    useActivityData(marketPublicKey);

  useEffect(() => {
    if (inView && !isFetchingNextPage && !isListEnded) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isFetchingNextPage, isListEnded]);

  const activityData = data?.pages
    ?.map((page) => {
      return page.data.filter(
        (activity) => activity.solAmount > 0 && activity.solAmount !== 0,
      );
    })
    .flat();

  return (
    <div className={styles.tabContentWrapper}>
      <ItemsList
        data={activityData}
        mapType={ACTIVITY}
        pubKey={PubKeys.NFT_MINT}
        onRowClick={() => null}
        tableClassName={styles.activityTable}
      />
      {!!isFetchingNextPage && <Spinner />}
      <div ref={ref} />
    </div>
  );
});

CollectionActivityTab.displayName = 'CollectionActivityTab';
