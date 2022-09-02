import { FC } from 'react';
import { Typography } from 'antd';
import classNames from 'classnames';

import solanaLogo from '../../assets/icons/svg/solana-sol-logo.svg';
import styles from './SolPrice.module.scss';

interface SolPriceProps {
  price: number;
  raw?: boolean;
}

export const SolPrice: FC<SolPriceProps> = ({ price, raw }) => (
  <Typography.Text className={styles.cardPrice}>
    <img width={16} height={16} src={solanaLogo} />{' '}
    {price ? (raw ? (price / 1e9).toFixed(3) : price) : 0}
  </Typography.Text>
);
