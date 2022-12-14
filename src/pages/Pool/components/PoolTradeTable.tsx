import { FC, useEffect, useMemo, memo } from 'react';
import { useSelector } from 'react-redux';

import styles from './styles.module.scss';
import { useIntersection } from '../../../hooks';
import { PubKeys } from '../../../types';
import { TRADE } from '../../../constants/common';
import { Spinner } from '../../../components/Spinner/Spinner';
import ItemsList from '../../../components/ItemsList';
import { selectCertainPair } from '../../../state/core/selectors';
import { useTableData } from '../../../requests';

const url = `https://${process.env.BACKEND_DOMAIN}/trades/pair`;

export const PoolTradeTable: FC = memo(() => {
  const { ref, inView } = useIntersection();
  const pool = useSelector(selectCertainPair);

  const params = {
    url,
    publicKey: pool?.pairPubkey,
    id: 'marketTrade',
  };

  const { data, fetchNextPage, isFetchingNextPage, isListEnded } =
    useTableData(params);

  useEffect(() => {
    if (inView && !isFetchingNextPage && !isListEnded) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isFetchingNextPage, isListEnded]);

  const tradeData = useMemo(() => {
    return data?.pages
      ?.map((page) => {
        return page.data.filter(
          (trade) => trade.solAmount > 0 && trade.solAmount !== 0,
        );
      })
      .flat();
  }, [data]);

  return (
    <div className={styles.tabContentWrapper}>
      <ItemsList
        data={tradeData}
        mapType={TRADE}
        pubKey={PubKeys.NFT_MINT}
        onRowClick={() => null}
        tableClassName={styles.tradeTable}
      />
      {!!isFetchingNextPage && <Spinner />}
      <div ref={ref} />
    </div>
  );
});

PoolTradeTable.displayName = 'PoolTradeTable';
