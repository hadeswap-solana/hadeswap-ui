import { FC } from 'react';
import { useFetchAllStats, useFetchTVL } from '../hooks';
import { SolanaLogo } from '../../../icons/SolanaLogo';
import { Spinner } from '../../../components/Spinner/Spinner';
import { formatPriceNumber } from '../../../utils/solanaUtils';
import { createStatData } from '../helpers';

import styles from './styles.module.scss';

export const Stats: FC = () => {
  const { allStats, allStatsLoading } = useFetchAllStats();
  const { TVLstat, TVLStatLoading } = useFetchTVL();

  const statData = createStatData({
    TVL: parseFloat(TVLstat),
    volume: allStats.volumeAll,
    volume24: allStats.volume24h,
  });

  const isLoading = allStatsLoading || TVLStatLoading;

  return (
    <div className={styles.statsWrapper}>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {Object.entries(statData).map(([label, value]) => (
            <div key={label} className={styles.statsBlock}>
              <span className={styles.statsLabel}>{label}</span>
              <div className={styles.statsPriceBlock}>
                <span className={styles.statsNumber}>
                  {value ? formatPriceNumber.format(value) : '--'}
                </span>
                <SolanaLogo />
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
