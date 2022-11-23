import { FC } from 'react';
import classNames from 'classnames';
import { Card } from '../../../components/Card';
import { SolRoundElement } from '../../../components/UI/SolanaBadge';
import { ArrowsLeftRightIcon } from '../../../icons/ArrowsLeftRightIcon';
import { NFTBadge } from '../../../components/UI/NFTBadge';
import { TradingBadge } from '../../../components/UI/TradingBadge';
import { PairType } from 'hadeswap-sdk/lib/hadeswap-core/types';

import styles from './styles.module.scss';

interface StepTwoProps {
  setStep: (arg: number) => void;
  pairType: PairType;
  setPairType: (arg: PairType) => void;
}

export const StepTwo: FC<StepTwoProps> = ({
  setStep,
  pairType,
  setPairType,
}) => {
  const onCardClick = (type: PairType) => {
    setPairType(type);
    setStep(2);
  };

  return (
    <>
      <Card
        className={classNames(styles.poolTypeWidget, {
          [styles.active]: pairType === PairType.TokenForNFT,
        })}
        onClick={() => onCardClick(PairType.TokenForNFT)}
      >
        <div className={styles.poolTypeBadges}>
          <SolRoundElement />
          <ArrowsLeftRightIcon />
          <NFTBadge />
        </div>
        <span className={styles.poolTypeTitle}>buy NFTs with SOL</span>
      </Card>
      <Card
        className={classNames(styles.poolTypeWidget, {
          [styles.active]: pairType === PairType.NftForToken,
        })}
        onClick={() => onCardClick(PairType.NftForToken)}
      >
        <div className={styles.poolTypeBadges}>
          <NFTBadge />
          <ArrowsLeftRightIcon />
          <SolRoundElement />
        </div>
        <span className={styles.poolTypeTitle}>Sell NFTs for SOL</span>
      </Card>
      <Card
        className={classNames(styles.poolTypeWidget, {
          [styles.active]: pairType === PairType.LiquidityProvision,
        })}
        onClick={() => onCardClick(PairType.LiquidityProvision)}
      >
        <div className={styles.poolTypeBadges}>
          <div className={styles.combineBadges}>
            <SolRoundElement />
            <NFTBadge className={styles.nftBadge} />
          </div>
          <ArrowsLeftRightIcon />
          <TradingBadge />
        </div>
        <span className={styles.poolTypeTitle}>
          Do both and earn trading fees
        </span>
      </Card>
    </>
  );
};
