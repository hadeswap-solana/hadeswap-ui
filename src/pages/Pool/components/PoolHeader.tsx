import { FC } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '../../../components/Buttons/Button';
import { BlackButton } from '../../../components/Buttons/BlackButton';
import { CombinedBadges } from '../../../components/UI/CombinedBadges';
import { SolRoundElement } from '../../../components/UI/SolanaBadge';
import { ArrowsLeftRightIcon } from '../../../icons/ArrowsLeftRightIcon';
import { TradingBadge } from '../../../components/UI/TradingBadge';
import { ImageBadge } from '../../../components/UI/ImageBadge';
import { HeaderWidgetCard } from './HeaderWidgetCard';
import { WithdrawFees } from '../../../components/WithdrawFees';
import { useWithdrawFees } from '../../../components/WithdrawFees/useWithdrawFees';
import { createEditPoollLink } from '../../../constants';
import { MarketInfo, Pair } from '../../../state/core/types';

import styles from './styles.module.scss';
import { useWallet } from '@solana/wallet-adapter-react';

interface PoolHeaderProps {
  market: MarketInfo;
  pool: Pair;
}

export const PoolHeader: FC<PoolHeaderProps> = ({ market, pool }) => {
  const history = useHistory();
  const wallet = useWallet();

  const isOwner =
    wallet.publicKey && wallet.publicKey?.toBase58() === pool?.assetReceiver;

  const onEdit = () => {
    history.push(createEditPoollLink(pool.pairPubkey));
  };

  const { accumulatedFees, onWithdrawClick } = useWithdrawFees({ pool });

  return (
    <div className={styles.header}>
      <div className={styles.badgesWrapper}>
        <BlackButton
          className={styles.backButton}
          onClick={() => history.goBack()}
        >
          <span>{'<'}&nbsp;&nbsp;back</span>
        </BlackButton>
        <div className={styles.badges}>
          <CombinedBadges
            BaseBadge={<SolRoundElement />}
            ShiftedBadge={
              <ImageBadge
                src={market.collectionImage}
                name={market.collectionName}
              />
            }
          />
          <ArrowsLeftRightIcon />
          <TradingBadge />
        </div>
      </div>
      <div className={styles.widgetsWrapper}>
        <HeaderWidgetCard title="pool" pairPubkey={pool.pairPubkey} />
        <HeaderWidgetCard title="owner" pairPubkey={market.marketPubkey} />
        {isOwner && (
          <WithdrawFees
            accumulatedFees={accumulatedFees}
            onClick={onWithdrawClick}
          />
        )}
      </div>
      <div className={styles.headerButtonsWrapper}>
        {isOwner && (
          <Button outlined onClick={onEdit} className={styles.editPoolButton}>
            <span>edit pool</span>
          </Button>
        )}
      </div>
    </div>
  );
};
