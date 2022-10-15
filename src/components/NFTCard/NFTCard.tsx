import { FC, memo } from 'react';
import { Button, Typography } from 'antd';
import classNames from 'classnames';

import styles from './NFTCard.module.scss';
import solanaLogo from '../../assets/icons/svg/solana-sol-logo.svg';

interface NFTCardProps {
  className?: string;
  selected?: boolean;
  disabled?: boolean;
  imageUrl: string;
  name?: string;
  price?: string;
  onBtnClick?: () => void;
}

export const NFTCard: FC<NFTCardProps> = memo(({
  className,
  selected = false,
  disabled = false,
  imageUrl,
  name,
  price,
  onBtnClick,
}) => {
  return (
    <div
      className={classNames(
        styles.card,
        { [styles.cardSelected]: selected },
        { [styles.cardDisabled]: disabled },
        className,
      )}
      onClick={onBtnClick}
    >
      <img className={styles.cardImage} src={imageUrl} alt={name} />
      {(name || price) && (
        <div className={styles.cardContent}>
          {name && (
            <Typography.Title level={5} className={styles.cardTitle}>
              {name}
            </Typography.Title>
          )}
          {price && (
            <Typography.Text className={styles.cardPrice}>
              <img width={16} height={16} src={solanaLogo} /> {price}
            </Typography.Text>
          )}
          {onBtnClick && (
            <Button type="primary" block>
              {!selected ? 'select' : 'deselect'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
});
