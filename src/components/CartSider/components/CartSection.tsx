import { FC } from 'react';
import { TrashIcon } from '../../../icons/TrashIcon';
import { SolPrice } from '../../SolPrice/SolPrice';
import Card from './Card';
import { CartOrder } from '../../../state/core/types';
import { TokenItem } from '../../../constants/tokens';
import { TokenPrice } from '../../TokenPrice';

import styles from './styles.module.scss';

interface CartSectionProps {
  title: string;
  cartItems: CartOrder[];
  onDeselectBulkHandler?: (arg: CartOrder[]) => void;
  createOnDeselectHandler?: (arg: CartOrder) => () => void;
  totalPrice: number;
  tokenExchange?: TokenItem;
  tokenRate?: number;
  tokenFormattedAmount?: string;
  tokenLoading?: boolean;
}

const CartSection: FC<CartSectionProps> = ({
  title,
  cartItems,
  onDeselectBulkHandler,
  createOnDeselectHandler,
  totalPrice,
  tokenExchange,
  tokenRate,
  tokenFormattedAmount,
  tokenLoading,
}) => {
  return (
    <>
      {!!cartItems.length && (
        <div className={styles.cartSection}>
          <div className={styles.cartHeader}>
            <div className={styles.cartHeaderTitle}>
              <h4>{title}</h4>
              <button
                className={styles.trashAllButton}
                onClick={() => onDeselectBulkHandler(cartItems)}
              >
                <TrashIcon />
              </button>
            </div>
            {tokenExchange ? (
              <TokenPrice
                token={tokenExchange}
                tokenAmount={tokenFormattedAmount}
                tokenLoading={tokenLoading}
                className={styles.cartHeaderPrice}
              />
            ) : (
              <SolPrice
                className={styles.cartHeaderPrice}
                price={totalPrice}
                raw
              />
            )}
          </div>
          <div className={styles.cartItems}>
            {cartItems.map((item) => (
              <Card
                key={item.mint}
                name={item.name}
                imageUrl={item.imageUrl}
                price={item.price}
                onDeselect={createOnDeselectHandler(item)}
                token={tokenExchange}
                tokenRate={tokenRate}
                tokenLoading={tokenLoading}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default CartSection;
