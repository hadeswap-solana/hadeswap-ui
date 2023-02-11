import { FC } from 'react';
import classNames from 'classnames';
import { SolanaLogo } from '../../icons/SolanaLogo';
import { formatNumericDigit } from '../../utils';

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
}) => {
  const amount: number = raw ? price / 1e9 : price;
  const value: string = formatNumericDigit(amount.toFixed(3));

  return (
    <div className={classNames(styles.price, className)}>
      {!rightIcon && <SolanaLogo />}
      <span className={styles.value}>{value}</span>
      {rightIcon && <SolanaLogo className={styles.rightIcon} />}
    </div>
  );
};
