import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems } from '../../state/core/selectors';
import { commonActions } from '../../state/common/actions';
// import { BellIcon } from '../../icons/BellIcon';
// import RoundIconButton from '../Buttons/RoundIconButton';
import BadgeButton from '../Buttons/BadgeButton';

import styles from './Header.module.scss';

const CartBlock: FC = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const itemsAmount = cartItems.buy.length + cartItems.sell.length;

  return (
    <div className={styles.cartBlock}>
      {/* <RoundIconButton onClick={() => null}>
        <BellIcon />
      </RoundIconButton> */}
      <BadgeButton
        itemsAmount={itemsAmount}
        onClick={() => dispatch(commonActions.toggleCartSider())}
      />
    </div>
  );
};

export default CartBlock;
