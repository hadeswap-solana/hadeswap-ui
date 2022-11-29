import { FC, useEffect, useState, memo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

import styles from './styles.module.scss';
import { NftActivityData } from '../../../state/core/types';
import { useIntersection } from '../../../hooks';
import { PubKeys, TRADE } from '../../../constants/common';
import { Spinner } from '../../../components/Spinner/Spinner';
import ItemsList from '../../../components/ItemsList';
import { selectCertainPair } from '../../../state/core/selectors';

const useTradeData = (pairPubkey: string) => {
  const LIMIT = 3;

  const [isListEnded, setIsListEnded] = useState<boolean>(false);

  const fetchData = async ({
    pageParam,
    pairPubkey,
  }: {
    pageParam: number;
    pairPubkey: string;
  }) => {
    const data: NftActivityData[] = await (
      await fetch(
        `https://${
          process.env.BACKEND_DOMAIN
        }/trades/pair/${pairPubkey}?sortBy=timestamp&sort=desc&limit=${LIMIT}&skip=${
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
    ['pairPubkey', pairPubkey],
    ({ pageParam = 0 }) => fetchData({ pairPubkey, pageParam }),
    {
      enabled: !!pairPubkey,
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

export const PoolTradeTable: FC = memo(() => {
  const { ref, inView } = useIntersection();
  const pool = useSelector(selectCertainPair);

  const { data, fetchNextPage, isFetchingNextPage, isListEnded } = useTradeData(
    pool?.pairPubkey,
  );

  useEffect(() => {
    if (inView && !isFetchingNextPage && !isListEnded) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isFetchingNextPage, isListEnded]);

  const tradeData = data?.pages
    ?.map((page) => {
      return page.data.filter(
        (trade) => trade.solAmount > 0 && trade.solAmount !== 0,
      );
    })
    .flat();

  return (
    <div className={styles.tabContentWrapper}>
      <ItemsList
        data={tradeData}
        mapType={TRADE}
        pubKey={PubKeys.NFT_MINT}
        onRowClick={() => null}
        tableClassName={styles.activityTable}
      />
      {!!isFetchingNextPage && <Spinner />}
      <div ref={ref} />
    </div>
  );
});

PoolTradeTable.displayName = 'PoolTradeTable';
