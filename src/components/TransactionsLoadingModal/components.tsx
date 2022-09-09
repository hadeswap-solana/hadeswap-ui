import { Typography } from 'antd';
import { BN } from 'hadeswap-sdk';
import { FC } from 'react';
import { formatBNToString } from '../../utils';
import styles from './TransactionsLoadingModal.module.scss';
import solanaLogo from '../../assets/icons/svg/solana-sol-logo.svg';

export const SolAmount: FC<{ solAmount: number }> = ({ solAmount }) => {
  return (
    <span className={styles.cardPrice}>
      <img width={16} height={16} src={solanaLogo} />{' '}
      {formatBNToString(new BN(solAmount))}
    </span>
  );
};

export const IxCard: FC = ({ children }) => {
  return <div className={styles.card}>{children}</div>;
};

export const IxCardText: FC = ({ children }) => (
  <Typography.Text className={styles.cardText}>{children}</Typography.Text>
);

export const IxCardImage: FC<{ src: string; alt?: string }> = ({
  src,
  alt = '',
}) => <img className={styles.cardImage} src={src} alt={alt} />;
