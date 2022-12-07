import { FC } from 'react';
import classNames from 'classnames';
import { Card } from '../../../components/Card';
import { SolRoundElement } from '../../../components/UI/SolanaBadge';
import { TradingBadge } from '../../../components/UI/TradingBadge';
import { CombinedBadges } from '../../../components/UI/CombinedBadges';
import { Spinner } from '../../../components/Spinner/Spinner';

import { PairType } from 'hadeswap-sdk/lib/hadeswap-core/types';
import { MarketInfo } from '../../../state/core/types';

import { ImageBadge } from '../../../components/UI/ImageBadge';
import { ArrowRightIcon } from '../../../icons/ArrowRightIcon';
import { ArrowsLeftRightIcon } from '../../../icons/ArrowsLeftRightIcon';
import styles from './styles.module.scss';

interface StepTwoProps {
  setStep: (arg: number) => void;
  pairType: PairType;
  setPairType: (arg: PairType) => void;
  market: MarketInfo;
  marketLoading: boolean;
}

export const StepTwo: FC<StepTwoProps> = ({
  setStep,
  pairType,
  setPairType,
  market,
  marketLoading,
}) => {
  const onCardClick = (type: PairType) => {
    setPairType(type);
    setStep(2);
  };

  return (
    <>
      {marketLoading ? (
        <Spinner />
      ) : (
        <div className={styles.cards}>
          <Card
            className={classNames(styles.poolTypeWidget, {
              [styles.active]: pairType === PairType.TokenForNFT,
            })}
            onClick={() => onCardClick(PairType.TokenForNFT)}
          >
            <div className={styles.poolTypeBadges}>
              <SolRoundElement />
              <ArrowRightIcon />
              <ImageBadge
                src={market?.collectionImage}
                name={market?.collectionName}
              />
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
              <ImageBadge
                src={market?.collectionImage}
                name={market?.collectionName}
              />
              <ArrowRightIcon />
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
              <CombinedBadges
                BaseBadge={<SolRoundElement />}
                ShiftedBadge={
                  <ImageBadge
                    src={market?.collectionImage}
                    name={market?.collectionName}
                  />
                }
              />
              <ArrowsLeftRightIcon />
              <TradingBadge />
            </div>
            <span className={styles.poolTypeTitle}>
              Do both and earn trading fees
            </span>
          </Card>
        </div>
      )}
    </>
  );
};
