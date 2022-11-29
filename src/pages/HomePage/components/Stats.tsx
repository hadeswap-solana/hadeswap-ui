import { FC } from 'react';
import { useStats } from '../hooks';
import { SolanaLogo } from '../../../icons/SolanaLogo';
import { Spinner } from '../../../components/Spinner/Spinner';
import { formatPriceNumber } from '../../../utils/solanaUtils';

import styles from './styles.module.scss';

export const Stats: FC = () => {
  const { data, isLoading } = useStats();

  return (
    <div className={styles.statsWrapper}>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {Object.entries(data).map(([label, value]) => (
            <div key={label} className={styles.statsBlock}>
              <span className={styles.statsLabel}>{label}</span>
              <div className={styles.statsPriceBlock}>
                <span className={styles.statsNumber}>
                  {value ? formatPriceNumber.format(parseFloat(value)) : '--'}
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
