import { FC, useEffect, Fragment } from 'react';
import { CollectionPageLayout } from './CollectionPageLayout';
import styles from './Collection.module.scss';
import { NFTCard } from '../../components/NFTCard/NFTCard';
import { NavLink, useParams } from 'react-router-dom';
import { Spinner } from '../../components/Spinner/Spinner';
import { shortenAddress } from '../../utils/solanaUtils';
import { SolPrice } from '../../components/SolPrice/SolPrice';
import moment from 'moment';
import classNames from 'classnames';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';

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
  const LIMIT = 10;

  const fetchData = async ({
    pageParam = 0,
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

    return {
      pageParam,
      data,
    };
  };

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ['marketActivity', marketPublicKey],
    ({ pageParam }) => fetchData({ marketPublicKey, pageParam }),
    {
      enabled: !!marketPublicKey,
      getPreviousPageParam: (firstPage) => firstPage.pageParam - 1 ?? undefined,
      getNextPageParam: (lastPage) => lastPage.pageParam + 1 ?? undefined,
      cacheTime: 100_000,
      networkMode: 'offlineFirst',
    },
  );

  return {
    data,
    fetchNextPage,
    isFetchingNextPage,
  };
};

export const CollectionActivityPage: FC = () => {
  const { ref, inView } = useInView();

  const { publicKey: marketPublicKey } = useParams<{ publicKey: string }>();

  const { data, fetchNextPage, isFetchingNextPage } =
    useActivityData(marketPublicKey);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return (
    <CollectionPageLayout>
      <div className={styles.activityCards}>
        {data?.pages?.map((page, idx) => (
          <Fragment key={idx}>
            {page.data.map((activity) => (
              <ActivityCard data={activity} key={activity.signature} />
            ))}
          </Fragment>
        ))}
        {!!isFetchingNextPage && <Spinner />}
        <div ref={ref} />
      </div>
    </CollectionPageLayout>
  );
};

interface ActivityCardProps {
  data: ActivityData;
}

const ActivityCard: FC<ActivityCardProps> = ({ data }) => {
  const isBuy = data.orderType === 'buy';

  return (
    <div className={styles.activityCard}>
      <a
        href={`https://solscan.io/token/${data.nftMint}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <NFTCard
          imageUrl={data.nftImageUrl}
          name={data.nftName}
          className={styles.activityNft}
        />
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
