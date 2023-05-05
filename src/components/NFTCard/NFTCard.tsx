import { FC } from 'react';
import classNames from 'classnames';

import RoundIconButton from '../Buttons/RoundIconButton';
import { ImageHolder } from '../UI/ImageHolder';
import { SolPrice } from '../SolPrice/SolPrice';
import { UNTITLED } from '../../constants/common';
import { NftRarity } from '../../state/core/types';
import styles from './NFTCard.module.scss';
import HowRareIsIcon from '../../icons/HowRareIsIcon';
import MoonRankIcon from '../../icons/MoonRankIcon';
import { SwapButton } from '../Buttons/SwapButton';
import { useWallet } from '@solana/wallet-adapter-react';
import { PlusIcon } from '../../icons/PlusIcon';
import { MinusIcon } from '../../icons/MinusIcon';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAllSellOrdersForMarket } from '../../state/core/selectors';
import { useCalcNftRoyalty } from '../../hooks/useCalcNftRoyalty';
import { formatRawSol } from '../../utils/solanaUtils';

interface NFTCardProps {
  className?: string;
  selected?: boolean;
  disabled?: boolean;
  simpleCard?: boolean;
  wholeAreaSelect?: boolean;
  imageUrl: string;
  name: string;
  price?: string;
  royaltyPercent?: number;
  rarity?: NftRarity;
  onCardClick?: () => void;
  onExchange?: () => void;
  withoutAddToCartBtn?: boolean;
  createPool?: boolean;
  isPnft: boolean;
}

export const NFTCard: FC<NFTCardProps> = ({
  className,
  selected = false,
  disabled = false,
  simpleCard = false,
  wholeAreaSelect = false,
  imageUrl,
  name = UNTITLED,
  price,
  royaltyPercent,
  rarity,
  onCardClick,
  onExchange,
  withoutAddToCartBtn,
  createPool = false,
  isPnft,
}) => {
  const { connected } = useWallet();
  const { publicKey: marketPublicKey } = useParams<{ publicKey: string }>();
  const sellOrders = useSelector((state: never) =>
    selectAllSellOrdersForMarket(state, marketPublicKey),
  );

  const royalty = useCalcNftRoyalty({
    nftPrice: parseFloat(price),
    royaltyPercent,
  });

  return (
    <div
      className={classNames(
        styles.card,
        { [styles.cardSelected]: selected },
        { [styles.cardDisabled]: disabled },
        { [styles.wholeAreaSelect]: !disabled && !selected && wholeAreaSelect },
        className,
      )}
      onClick={onCardClick && onCardClick}
    >
      <div className={styles.cardImageWrapper}>
        <ImageHolder imageUrl={imageUrl} alt={name} />
        {!!rarity && <Rarity rarity={rarity} />}
      </div>
      <div className={styles.cardContent}>
        <h5 className={styles.cardTitle}>{name}</h5>
        {!simpleCard && (
          <SolPrice className={styles.cardPrice} price={parseFloat(price)} />
        )}
        {!!royalty && (
          <div className={styles.royaltyBlock}>
            <span className={styles.title}>pnft royalty:</span>
            <SolPrice className={styles.price} price={royalty.toNumber()} />
          </div>
        )}
        <div className={styles.cardBtnWrapper}>
          {!simpleCard && !withoutAddToCartBtn && (
            <RoundIconButton className={styles.cardButton}>
              {selected ? <MinusIcon /> : <PlusIcon />}
            </RoundIconButton>
          )}
          {createPool && (
            <RoundIconButton className={styles.cardButton}>
              {selected ? <MinusIcon /> : <PlusIcon />}
            </RoundIconButton>
          )}
          {onExchange && !isPnft && (
            <SwapButton
              isDisabled={!sellOrders.length}
              onClick={(e) => {
                e.stopPropagation();
                if (connected) {
                  onExchange();
                }
                return;
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

interface RarityProps {
  rarity: NftRarity;
  className?: string;
}

export const Rarity: FC<RarityProps> = ({ rarity, className }) => {
  return (
    <div className={classNames(styles.rarityWrapper, className)}>
      {!!rarity.howRareIs && (
        <div className={styles.rarityValue}>
          <HowRareIsIcon /> {rarity.howRareIs}
        </div>
      )}
      {!!rarity.moonRank && (
        <div className={styles.rarityValue}>
          <MoonRankIcon /> {rarity.moonRank}
        </div>
      )}
    </div>
  );
};
