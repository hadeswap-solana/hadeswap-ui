import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems } from '../../state/core/selectors';
import { BellIcon } from '../../icons/BellIcon';
import { CartIcon } from '../../icons/CartIcon';

import styles from './Header.module.scss';
import { commonActions } from '../../state/common/actions';

const CartBlock = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const itemsAmount = cartItems.buy.length + cartItems.sell.length;

  return (
    <div className={styles.cartBlock}>
      <button className={styles.cartIconWrapper}>
        <BellIcon />
      </button>
      <div className={styles.cartButtonWrapper}>
        {!!itemsAmount && (
          <div className={styles.cartButtonBadge}>{itemsAmount}</div>
        )}
        <button
          className={styles.cartIconWrapper}
          onClick={() => dispatch(commonActions.toggleCartSider())}
        >
          <CartIcon />
        </button>
      </div>
    </div>
  );
};

export default CartBlock;
