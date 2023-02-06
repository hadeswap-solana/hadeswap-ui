import { FC, memo } from 'react';
import { Typography } from 'antd';
import { SolPrice } from '../../SolPrice/SolPrice';
import { TokenPrice } from '../../TokenPrice';
import DeleteButton from '../../Buttons/DeleteButton';
import { Rarity } from '../../NFTCard/NFTCard';
import { NftRarity } from '../../../state/core/types';
import { TokenItem } from '../../../constants/tokens';

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
  return (
    <div className={styles.card}>
      <img className={styles.cardImage} src={imageUrl} alt={name} />
      {!!rarity && <Rarity className={styles.rarityWrapper} rarity={rarity} />}
      <div className={styles.cardContent}>
        <Typography.Title level={5} className={styles.cardTitle}>
          {name}
        </Typography.Title>
        {token ? (
          <TokenPrice
            token={token}
            tokenAmount={(parseFloat(price) * tokenRate).toFixed(3)}
            tokenLoading={tokenLoading}
            className={styles.cardPrice}
          />
        ) : (
          <SolPrice className={styles.cardPrice} price={parseFloat(price)} />
        )}
      </div>
      {onDeselect && (
        <DeleteButton className={styles.deleteButton} onClick={onDeselect} />
      )}
    </div>
  );
};

export default memo(Card);
