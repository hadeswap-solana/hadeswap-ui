import { FC } from 'react';
import { Button, Typography } from 'antd';
import classNames from 'classnames';

import styles from './NFTCard.module.scss';
import solanaLogo from '../../assets/icons/svg/solana-sol-logo.svg';

interface NFTCardProps {
  className?: string;
  selected?: boolean;
  imageUrl: string;
  name: string;
  price?: string;
  onBtnClick?: () => void;
}

export const NFTCard: FC<NFTCardProps> = ({
  className,
  selected = false,
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
        className,
      )}
    >
      <img className={styles.cardImage} src={imageUrl} alt={name} />
      <div className={styles.cardContent}>
        <Typography.Title level={5} className={styles.cardTitle}>
          {name}
        </Typography.Title>
        {price && (
          <Typography.Text className={styles.cardPrice}>
            <img width={16} height={16} src={solanaLogo} /> {price}
          </Typography.Text>
        )}
        {onBtnClick && (
          <Button type="primary" block onClick={onBtnClick}>
            {!selected ? 'Select' : 'Deselect'}
          </Button>
        )}
      </div>
    </div>
  );
};
