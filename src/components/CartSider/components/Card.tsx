import { FC, memo } from 'react';
import { SolPrice } from '../../SolPrice/SolPrice';
import { TokenPrice } from '../../TokenPrice';
import DeleteButton from '../../Buttons/DeleteButton';
import { Rarity } from '../../NFTCard/NFTCard';
import { NftRarity } from '../../../state/core/types';
import { TokenItem } from '../../../constants/tokens';
import { calcTokenAmount } from '../../../utils';

import styles from './styles.module.scss';

interface CardProps {
  imageUrl: string;
  name: string;
  price: string;
  onDeselect?: () => void;
  rarity?: NftRarity;
  token?: TokenItem;
  tokenRate?: number;
  tokenLoading?: boolean;
}

const Card: FC<CardProps> = ({
  name,
  price,
  imageUrl,
  onDeselect,
  rarity,
  token,
  tokenRate,
  tokenLoading,
}) => {
  const solAmount = (parseFloat(price) / 1e9).toFixed(3);
  const tokenAmount = calcTokenAmount(solAmount, tokenRate);

  return (
    <div className={styles.card}>
      <img className={styles.cardImage} src={imageUrl} alt={name} />
      {!!rarity && <Rarity className={styles.rarityWrapper} rarity={rarity} />}
      <div className={styles.cardContent}>
        <h5 className={styles.cardTitle}>{name}</h5>
        {token ? (
          <TokenPrice
            token={token}
            tokenAmount={tokenAmount}
            tokenLoading={tokenLoading}
            className={styles.cardPrice}
          />
        ) : (
          <SolPrice className={styles.cardPrice} price={Number(solAmount)} />
        )}
      </div>
      {onDeselect && (
        <DeleteButton className={styles.deleteButton} onClick={onDeselect} />
      )}
    </div>
  );
};

export default memo(Card);
