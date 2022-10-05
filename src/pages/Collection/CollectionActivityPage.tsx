import { memo, FC, useEffect, Fragment, useState } from 'react';
import { CollectionPageLayout } from './CollectionPageLayout';
import styles from './Collection.module.scss';
import { NavLink, useParams } from 'react-router-dom';
import { Spinner } from '../../components/Spinner/Spinner';
import { shortenAddress } from '../../utils/solanaUtils';
import { SolPrice } from '../../components/SolPrice/SolPrice';
import moment from 'moment';
import classNames from 'classnames';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useIntersection } from '../../hooks';

interface ActivityData {
  nftImageUrl: string;
  nftMint: string;
  nftName: string;
  orderType: 'sell' | 'buy';
  pair: string;
  pairType: string;
  signature: string;
  solAmount: number;
  timestamp: string;
  userMaker?: string;
  userTaker: string;
}

const useActivityData = (marketPublicKey: string) => {
  const LIMIT = 30;

  const [isListEnded, setIsListEnded] = useState<boolean>(false);

  const fetchData = async ({
    pageParam,
    marketPublicKey,
  }: {
    pageParam: number;
    marketPublicKey: string;
  }) => {
    const data: ActivityData[] = await (
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

const CollectionActivityPageBase: FC = () => {
  const { ref, inView } = useIntersection();

  const { publicKey: marketPublicKey } = useParams<{ publicKey: string }>();

  const { data, fetchNextPage, isFetchingNextPage, isListEnded } =
    useActivityData(marketPublicKey);

  useEffect(() => {
    if (inView && !isFetchingNextPage && !isListEnded) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isFetchingNextPage, isListEnded]);

  return (
    <CollectionPageLayout>
      <div className={styles.activityCards}>
        {data?.pages?.map((page, idx) => (
          <Fragment key={idx}>
            {page.data
              .filter(
                (activity) =>
                  activity.solAmount > 0 && activity.solAmount !== 0,
              )
              .map((activity, idx) => (
                <ActivityCard data={activity} key={idx} />
              ))}
          </Fragment>
        ))}
        {!!isFetchingNextPage && <Spinner />}
        <div ref={ref} />
      </div>
    </CollectionPageLayout>
  );
};

export const CollectionActivityPage = memo(CollectionActivityPageBase);

interface ActivityCardProps {
  data: ActivityData;
}

const ActivityCard: FC<ActivityCardProps> = ({ data }) => {
  const isBuy = data.orderType === 'buy';

  return (
    <div className={styles.activityCard}>
      <img
        src={data.nftImageUrl}
        alt={data.nftName}
        className={styles.activityNftImage}
      />
      <a
        href={`https://solscan.io/token/${data.nftMint}`}
        target="_blank"
        rel="noopener noreferrer"
        className={classNames(styles.activityNftName, styles.activityLink)}
      >
        {data.nftName}
      </a>
      <p className={styles.activityTaker}>
        {isBuy ? 'was bought by ' : 'was sold by '}
        <a
          href={`https://solscan.io/account/${data.userTaker}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.activityLink}
        >
          {shortenAddress(data.userTaker)}
        </a>{' '}
      </p>

      <p className={styles.activityPool}>
        {isBuy ? 'from ' : 'to '}
        <NavLink to={`/pools/${data.pair}`} className={styles.activityLink}>
          {shortenAddress(data.pair)}
        </NavLink>{' '}
        pool
      </p>
      <p className={styles.activityPrice}>
        for{' '}
        <SolPrice
          price={data.solAmount}
          className={styles.solPrice}
          logoClassName={styles.solLogo}
        />{' '}
      </p>
      <a
        href={`https://solscan.io/tx/${data.signature}`}
        target="_blank"
        rel="noopener noreferrer"
        className={classNames(styles.activityDate, styles.activityLink)}
      >
        {moment(data.timestamp).fromNow()}
      </a>
    </div>
  );
};
