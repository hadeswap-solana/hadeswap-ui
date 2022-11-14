import { FC } from 'react';
import { Typography } from 'antd';
import classNames from 'classnames';
import { SolanaLogo } from '../../icons/SolanaLogo';

import styles from './SolPrice.module.scss';

interface SolPriceProps {
  price: number;
  raw?: boolean;
  className?: string;
}

export const SolPrice: FC<SolPriceProps> = ({ price, raw, className }) => (
  <div className={classNames(styles.price, className)}>
    <SolanaLogo />
    <Typography.Text>
      {!price && 0}
      {!isNaN(price) && !raw && price}
      {!isNaN(price) && raw && (price / 1e9).toFixed(3)}
    </Typography.Text>
  </div>
);
