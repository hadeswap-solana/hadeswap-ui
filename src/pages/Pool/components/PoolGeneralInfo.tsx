import { FC } from 'react';
import { BN } from 'hadeswap-sdk';
import { GeneralWidgetCard } from './GeneralWidgetCard';
import { parseDelta } from '../../../state/core/helpers';
import { Pair } from '../../../state/core/types';
import { formatBNToString } from '../../../utils';
import { formatRawSol } from '../../../utils/solanaUtils';

import styles from './styles.module.scss';
import { BondingCurveType } from 'hadeswap-sdk/lib/hadeswap-core/types';

interface PoolGeneralInfoProps {
  pool: Pair;
}

export const PoolGeneralInfo: FC<PoolGeneralInfoProps> = ({ pool }) => {
  const deltaName =
    pool?.bondingCurve === BondingCurveType.XYK ? 'nfts amount' : 'delta';
  const rawDelta =
    pool?.bondingCurve === BondingCurveType.XYK ? pool?.delta : pool?.nftsCount;

  return (
    <div className={styles.generalWrapper}>
      <h3 className={styles.generalTitle}>general info</h3>
      <div className={styles.widgetsWrapper}>
        <GeneralWidgetCard
          title="SOL balance"
          value={`${formatBNToString(
            new BN(pool?.fundsSolOrTokenBalance || '0'),
          )} SOL`}
        />
        <GeneralWidgetCard
          title="amount of NFTs"
          value={String(pool?.nftsCount) || '0'}
        />
        <GeneralWidgetCard
          title={deltaName}
          value={parseDelta(rawDelta, pool?.bondingCurve)}
        />
        <GeneralWidgetCard title="status" value={pool.pairState} />
        <GeneralWidgetCard
          title="accumulated fee"
          value={`${formatRawSol(pool?.totalAccumulatedFees)} SOL`}
        />
      </div>
    </div>
  );
};
