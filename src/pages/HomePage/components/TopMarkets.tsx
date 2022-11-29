import { FC } from 'react';
import { useTopMarkets } from '../hooks';
import { Spinner } from '../../../components/Spinner/Spinner';
import { MarketCard } from './MarketCard';

import styles from './styles.module.scss';

export const TopMarkets: FC = () => {
  const { topMarkets, topMarketsLoading } = useTopMarkets();
  topMarkets.length = 5;
  return (
    <>
      {topMarketsLoading ? (
        <Spinner />
      ) : (
        <>
          <h2 className={styles.topMarketsTitle}>
            All your awesome NFTs are here
          </h2>
          <ul className={styles.topMarkets}>
            {topMarkets.map((market, index) => (
              <MarketCard key={index} market={market} />
            ))}
          </ul>
        </>
      )}
    </>
  );
};
