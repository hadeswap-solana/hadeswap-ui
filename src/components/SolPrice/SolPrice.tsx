import { FC } from 'react';
import { Typography } from 'antd';

import solanaLogo from '../../assets/icons/svg/solana-sol-logo.svg';
import styles from './SolPrice.module.scss';
import classNames from 'classnames';

interface SolPriceProps {
  price: number;
  raw?: boolean;
  className?: string;
  logoClassName?: string;
}

export const SolPrice: FC<SolPriceProps> = ({
  price,
  raw,
  logoClassName,
  className,
}) => (
  <Typography.Text className={classNames(styles.price, className)}>
    <img src={solanaLogo} className={classNames(styles.logo, logoClassName)} />{' '}
    {price ? (raw ? (price / 1e9).toFixed(3) : price) : 0}
  </Typography.Text>
);
