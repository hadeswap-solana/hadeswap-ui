import { FC } from 'react';
import classNames from 'classnames';

import Button from '../Buttons/Button';
// import DeleteButton from '../Buttons/DeleteButton';
// import { PlusIcon } from '../../icons/PlusIcon';
// import { LoopIcon } from '../../icons/LoopIcon';
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

interface NFTCardProps {
  className?: string;
  selected?: boolean;
  disabled?: boolean;
  simpleCard?: boolean;
  wholeAreaSelect?: boolean;
  imageUrl: string;
  name: string;
  price?: string;
  rarity?: NftRarity;
  onCardClick?: () => void;
  onAddToCart?: () => void;
  onExchange?: () => void;
  withoutAddToCartBtn?: boolean;
  createPool?: boolean;
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
  rarity,
  onCardClick,
  // onAddToCart,
  onExchange,
  withoutAddToCartBtn,
  createPool = false,
}) => {
  const { connected } = useWallet();

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
        {/*{!simpleCard && !selected && (*/}
        {/*  <div className={styles.cardImageHover}>*/}
        {/*    <Button className={styles.cardButton} onClick={onAddToCart}>*/}
        {/*      <PlusIcon />*/}
        {/*      <span>add to cart</span>*/}
        {/*    </Button>*/}
        {/*    {onExchange && (*/}
        {/*      <Button className={styles.cardButton} onClick={onExchange}>*/}
        {/*        <LoopIcon />*/}
        {/*        <span>exchange</span>*/}
        {/*      </Button>*/}
        {/*    )}*/}
        {/*  </div>*/}
        {/*)}*/}
        {/* {selected && (
          <DeleteButton className={styles.deleteButton} onClick={onAddToCart} />
        )} */}
        <img className={styles.cardImage} src={imageUrl} alt={name} />
        {!!rarity && <Rarity rarity={rarity} />}
      </div>
      <div className={styles.cardContent}>
        <h5 className={styles.cardTitle}>{name}</h5>
        {!simpleCard && (
          <SolPrice className={styles.cardPrice} price={parseFloat(price)} />
        )}

        <div className={styles.cardBtnWrapper}>
          {!simpleCard && !withoutAddToCartBtn && (
            <Button outlined className={styles.cardButton}>
              {selected ? <MinusIcon /> : <PlusIcon />}
            </Button>
          )}
          {createPool && (
            <Button outlined className={styles.cardButton}>
              {selected ? <MinusIcon /> : <PlusIcon />}
            </Button>
          )}
          {onExchange && (
            <SwapButton
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
