import { FC } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { Card } from '../../../components/Card';
import { SolRoundElement } from '../../../components/UI/Badges/SolanaBadge';
import { TradingBadge } from '../../../components/UI/Badges/TradingBadge';
import { CombinedBadges } from '../../../components/UI/Badges/CombinedBadge';
import { Spinner } from '../../../components/Spinner/Spinner';
import {
  selectCertainMarket,
  selectCertainMarketLoading,
} from '../../../state/core/selectors';
import { PairType } from 'hadeswap-sdk/lib/hadeswap-core/types';

import { ImageBadge } from '../../../components/UI/Badges/ImageBadge';
import { ArrowRightIcon } from '../../../icons/ArrowRightIcon';
import { ArrowsLeftRightIcon } from '../../../icons/ArrowsLeftRightIcon';
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
  const market = useSelector(selectCertainMarket);
  const marketLoading = useSelector(selectCertainMarketLoading);

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
