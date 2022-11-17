import { FC } from 'react';
import { Typography } from 'antd';
import classNames from 'classnames';
import { SolanaLogo } from '../../icons/SolanaLogo';

import styles from './SolPrice.module.scss';

interface SolPriceProps {
  price: number;
  raw?: boolean;
  className?: string;
  rightIcon?: boolean;
}

export const SolPrice: FC<SolPriceProps> = ({
  price,
  raw = false,
  className,
  rightIcon,
}) => (
  <div className={classNames(styles.price, className)}>
    {!rightIcon && <SolanaLogo />}
    <Typography.Text>
      {!price && 0}
      {!isNaN(price) && !raw && price}
      {!isNaN(price) && raw && (price / 1e9).toFixed(3)}
    </Typography.Text>
    {rightIcon && <SolanaLogo className={styles.rightIcon} />}
  </div>
);
