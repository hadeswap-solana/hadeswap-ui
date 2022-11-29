import { FC, useEffect, memo } from 'react';
import { useParams } from 'react-router-dom';
import ItemsList from '../../../../components/ItemsList';
import { Spinner } from '../../../../components/Spinner/Spinner';
import { useIntersection } from '../../../../hooks';
import { ACTIVITY, PubKeys } from '../../../../constants/common';
import { useTableData } from '../../../../requests';

import styles from './styles.module.scss';

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
