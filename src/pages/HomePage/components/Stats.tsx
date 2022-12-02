import { FC } from 'react';
import { SolanaLogo } from '../../../icons/SolanaLogo';
import { formatPriceNumber } from '../../../utils/solanaUtils';
import { createStatData } from '../helpers';
import { AllStats } from '../../../requests/types';

import styles from './styles.module.scss';

interface StatsProps {
  TVLstat: string;
  allStats: AllStats;
}

export const Stats: FC<StatsProps> = ({ TVLstat, allStats }) => {
  const statData = createStatData({
    TVL: parseFloat(TVLstat),
    volume: allStats.volumeAll,
    volume24: allStats.volume24h,
  });

  console.log(statData, 'statData');

  return (
    <div className={styles.statsWrapper}>
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
    </div>
  );
};
