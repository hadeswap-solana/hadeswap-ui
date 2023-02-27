import { FC, useEffect, useMemo, memo } from 'react';
import { useParams } from 'react-router-dom';
import ItemsList from '../../../../components/ItemsList';
import { Spinner } from '../../../../components/Spinner/Spinner';
import { useIntersection } from '../../../../hooks';
import { ACTIVITY } from '../../../../constants/common';
import { PubKeys } from '../../../../types';
import { useTableData } from '../../../../requests';

import styles from './styles.module.scss';
import Chart from '../../../../components/Chart/Chart';
import useSwapHistory from '../../../../components/Chart/hooks/useSwapHistory';
import { chartIDs } from '../../../../components/Chart/constants';

const url = `https://${process.env.BACKEND_DOMAIN}/trades`;

export const CollectionActivityTab: FC = memo(() => {
  const { ref, inView } = useIntersection();

  const { publicKey: marketPublicKey } = useParams<{ publicKey: string }>();

  const params = {
    url,
    publicKey: marketPublicKey,
    id: 'marketActivity',
  };

  const { data, fetchNextPage, isFetchingNextPage, isListEnded } =
    useTableData(params);

  useEffect(() => {
    if (inView && !isFetchingNextPage && !isListEnded) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isFetchingNextPage, isListEnded]);

  const activityData = useMemo(() => {
    if (!Array.isArray(data?.pages)) {
      return [];
    }

    return data?.pages
      ?.map((page) => {
        return page?.data?.filter(
          (activity) => activity.solAmount > 0 && activity.solAmount !== 0,
        );
      })
      .flat();
  }, [data]);

  const {
    chartDataActivity,
    swapHistoryLoading,
    currentPeriod,
    setCurrentPeriod,
  } = useSwapHistory({ market: true });

  return (
    <div className={styles.tabContentWrapper}>
      <Chart
        title="swap history"
        data={chartDataActivity}
        chartID={chartIDs.swapHistory}
        swapHistoryLoading={swapHistoryLoading}
        currentPeriod={currentPeriod}
        setCurrentPeriod={setCurrentPeriod}
      />
      <ItemsList
        idKey="_id"
        data={activityData}
        mapType={ACTIVITY}
        pubKey={PubKeys.NFT_MINT}
        tableClassName={styles.activityTable}
      />
      <div ref={ref} />
      {!!isFetchingNextPage && (
        <div className={styles.spinnerWrapper}>
          <Spinner />
        </div>
      )}
    </div>
  );
});

CollectionActivityTab.displayName = 'CollectionActivityTab';
