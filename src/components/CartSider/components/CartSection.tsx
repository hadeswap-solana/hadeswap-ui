import { FC } from 'react';
import { TrashIcon } from '../../../icons/TrashIcon';
import { SolPrice } from '../../SolPrice/SolPrice';
import Card from './Card';
import { formatBNToString } from '../../../utils';
import BN from 'bn.js';
import { CartOrder } from '../../../state/core/types';

import styles from './styles.module.scss';

interface CartSectionProps {
  title: string;
  cartItems: CartOrder[];
  onDeselectBulkHandler?: (arg: CartOrder[]) => void;
  createOnDeselectHandler?: (arg: CartOrder) => () => void;
  totalPrice: number;
}

const CartSection: FC<CartSectionProps> = ({
  title,
  cartItems,
  onDeselectBulkHandler,
  createOnDeselectHandler,
  totalPrice,
}) => (
  <>
    {!!cartItems.length && (
      <div className={styles.cartSection}>
        <div className={styles.cartHeader}>
          <div className={styles.cartTitle}>
            <h4>{title}</h4>
            <button
              className={styles.trashAllButton}
              onClick={() => onDeselectBulkHandler(cartItems)}
            >
              <TrashIcon />
            </button>
          </div>
          <SolPrice price={totalPrice} raw />
        </div>
        <div className={styles.cartItems}>
          {cartItems.map((item) => (
            <Card
              key={item.mint}
              name={item.name}
              imageUrl={item.imageUrl}
              price={formatBNToString(new BN(item.price))}
              onDeselect={createOnDeselectHandler(item)}
            />
          ))}
        </div>
      </div>
    )}
  </>
);

export default CartSection;
