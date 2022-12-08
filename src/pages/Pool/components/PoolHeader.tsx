import { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import Button from '../../../components/Buttons/Button';
import { BlackButton } from '../../../components/Buttons/BlackButton';
import { CombinedBadges } from '../../../components/UI/Badges/CombinedBadge';
import { SolRoundElement } from '../../../components/UI/Badges/SolanaBadge';
import { ArrowsLeftRightIcon } from '../../../icons/ArrowsLeftRightIcon';
import { ImageBadge } from '../../../components/UI/Badges/ImageBadge';
import { HeaderWidgetCard } from './HeaderWidgetCard';
import { WithdrawFees } from '../../../components/WithdrawFees';
import { useWithdrawFees } from '../../../components/WithdrawFees/useWithdrawFees';
import { createEditPoollLink } from '../../../constants';
import { PairType } from 'hadeswap-sdk/lib/hadeswap-core/types';
import { MarketInfo, Pair } from '../../../state/core/types';

import { ArrowRightIcon } from '../../../icons/ArrowRightIcon';
import styles from './styles.module.scss';

interface PoolHeaderProps {
  market: MarketInfo;
  pool: Pair;
}

export const PoolHeader: FC<PoolHeaderProps> = ({ market, pool }) => {
  const history = useHistory();
  const wallet = useWallet();

  const isLiquidityProvision = pool.type === PairType.LiquidityProvision;
  const isBuy = pool.type === PairType.TokenForNFT;
  const isSell = pool.type === PairType.NftForToken;

  const isOwner =
    wallet.publicKey && wallet.publicKey?.toBase58() === pool?.assetReceiver;

  const onEdit = () => {
    history.push(createEditPoollLink(pool.pairPubkey));
  };

  const { onWithdrawClick, accumulatedFees, isWithdrawDisabled } =
    useWithdrawFees({ pool });

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
          {isBuy && (
            <>
              <SolRoundElement />
              <ArrowRightIcon />
              <ImageBadge
                src={market.collectionImage}
                name={market.collectionName}
              />
            </>
          )}
          {isSell && (
            <>
              <ImageBadge
                src={market.collectionImage}
                name={market.collectionName}
              />
              <ArrowRightIcon />
              <SolRoundElement />
            </>
          )}
          {isLiquidityProvision && (
            <>
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
              <SolRoundElement />
            </>
          )}
        </div>
      </div>
      <div className={styles.widgetsWrapper}>
        <HeaderWidgetCard title="pool" value={pool?.pairPubkey} />
        <HeaderWidgetCard title="owner" value={pool?.assetReceiver} />
        {isOwner && isLiquidityProvision && (
          <WithdrawFees
            isButtonDisabled={isWithdrawDisabled}
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
