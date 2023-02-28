import { FC } from 'react';
import cn from 'classnames';
import { TokenItem } from '../../constants/tokens';
import { Spinner } from '../Spinner/Spinner';
import { formatNumericDigit } from '../../utils';
import styles from './styles.module.scss';

interface TokenPriceProps {
  token: TokenItem;
  tokenAmount: string;
  tokenLoading: boolean;
  className?: string;
}

export const TokenPrice: FC<TokenPriceProps> = ({
  token,
  tokenAmount,
  tokenLoading,
  className,
}) => {
  const value = formatNumericDigit(tokenAmount);

  return (
    <div className={cn(styles.wrapper, className)}>
      <img className={styles.image} src={token.image} alt={token.label} />
      {tokenLoading ? (
        <Spinner className={styles.spinner} />
      ) : (
        <span className={styles.text}>{value}</span>
      )}
    </div>
  );
};
