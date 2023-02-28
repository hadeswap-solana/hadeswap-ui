import { FC } from 'react';
import { coreActions } from '../../../state/core/actions';
import { Typography } from 'antd';
import classNames from 'classnames';
import Card from './Card';
import { CartOrder } from '../../../state/core/types';

import styles from './styles.module.scss';

interface CartSectionInvalidProps {
  invalidItems: CartOrder[];
  dispatch: (arg: ReturnType<typeof coreActions.clearInvalidOrders>) => void;
}

const CartSectionInvalid: FC<CartSectionInvalidProps> = ({
  invalidItems,
  dispatch,
}) => (
  <>
    {!!invalidItems.length && (
      <div className={styles.cartSection}>
        <div className={styles.invalidCartTitleWrapper}>
          <div className={styles.cartHeader}>
            <h4>invalid&nbsp;{invalidItems.length}&nbsp;orders</h4>
            <button
              className={styles.clearButton}
              onClick={() => dispatch(coreActions.clearInvalidOrders())}
            >
              clear
            </button>
          </div>
          <Typography.Text>
            {
              "according blockchain changes, this orders aren't available anymore"
            }
          </Typography.Text>
        </div>
        <div className={classNames(styles.cartItems, styles.cartItemsInvalid)}>
          {invalidItems.map((item) => (
            <Card
              key={item.mint}
              name={item.name}
              imageUrl={item.imageUrl}
              price={item.price}
            />
          ))}
        </div>
      </div>
    )}
  </>
);

export default CartSectionInvalid;
