import { FC } from 'react';
import cn from 'classnames';
import { TokenItem } from '../../constants/tokens';
import { Spinner } from '../Spinner/Spinner';
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
  return (
    <div className={cn(styles.wrapper, className)}>
      {tokenLoading ? (
        <Spinner className={styles.spinner} />
      ) : (
        <>
          <img className={styles.image} src={token.image} alt={token.label} />
          <span className={styles.text}>{tokenAmount}</span>
        </>
      )}
    </div>
  );
};
