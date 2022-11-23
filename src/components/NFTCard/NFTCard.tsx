import { FC } from 'react';
import classNames from 'classnames';
import Button from '../Buttons/Button';
import DeleteButton from '../Buttons/DeleteButton';
import { PlusIcon } from '../../icons/PlusIcon';
import { LoopIcon } from '../../icons/LoopIcon';
import { SolPrice } from '../SolPrice/SolPrice';
import { UNTITLED } from '../../constants/common';

import styles from './NFTCard.module.scss';

interface NFTCardProps {
  className?: string;
  selected?: boolean;
  disabled?: boolean;
  simpleCard?: boolean;
  wholeAreaSelect?: boolean;
  imageUrl: string;
  name: string;
  price?: string;
  onCardClick?: () => void;
  onAddToCart?: () => void;
  onExchange?: () => void;
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
  onCardClick,
  onAddToCart,
  onExchange,
}) => {
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
        {!simpleCard && !selected && (
          <div className={styles.cardImageHover}>
            <Button className={styles.cardButton} onClick={onAddToCart}>
              <PlusIcon />
              <span>add to cart</span>
            </Button>
            <Button className={styles.cardButton} onClick={onExchange}>
              <LoopIcon />
              <span>exchange</span>
            </Button>
          </div>
        )}
        {selected && (
          <DeleteButton className={styles.deleteButton} onClick={onAddToCart} />
        )}
        <img className={styles.cardImage} src={imageUrl} alt={name} />
      </div>
      <div className={styles.cardContent}>
        <h5 className={styles.cardTitle}>{name}</h5>
        {!simpleCard && (
          <SolPrice className={styles.cardPrice} price={parseFloat(price)} />
        )}
      </div>
    </div>
  );
};
