import { FC, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectExchangeModalVisible,
  selectScreeMode,
} from '../../state/common/selectors';
import CartSiderDesktop from './CartSider';
import CartSiderMobile from './mobile/CartSider';
import { useCartSider, useSwap } from './hooks';
import { ScreenTypes } from '../../state/common/types';
import { CartOrder } from '../../state/core/types';
import { coreActions } from '../../state/core/actions';
import { txsLoadingModalActions } from '../../state/txsLoadingModal/actions';
import { commonActions } from '../../state/common/actions';

export interface CartSiderProps {
  createOnDeselectHandler: (arg: CartOrder) => () => void;
  onDeselectBulkHandler: (arg: CartOrder[]) => void;
  swap: () => Promise<void>;
  isSwapButtonDisabled: boolean;
  isCartEmpty: boolean;
  cartOpened?: boolean;
  cartItems: {
    buy: CartOrder[];
    sell: CartOrder[];
  };
  invalidItems: CartOrder[];
  itemsAmount: number;
  totalBuy: number;
  totalSell: number;
  isExchangeMode?: boolean;
}

const CartSider: FC = () => {
  const dispatch = useDispatch();
  const screenMode = useSelector(selectScreeMode);
  const exchangeModalVisible = useSelector(selectExchangeModalVisible);

  const {
    cartItems,
    cartOpened,
    isCartEmpty,
    invalidItems,
    itemsAmount,
    totalBuy,
    totalSell,
  } = useCartSider();

  const isSwapButtonDisabled = !itemsAmount;

  const { swap } = useSwap({
    onAfterTxn: () => dispatch(txsLoadingModalActions.setVisible(false)),
    onFail: () => dispatch(commonActions.setCartSider({ isVisible: true })),
  });

  const createOnDeselectHandler = (order: CartOrder) => () => {
    dispatch(coreActions.removeOrderFromCart(order.mint));
  };

  const onDeselectBulkHandler = (data) => {
    data.forEach((item) =>
      dispatch(coreActions.removeOrderFromCart(item.mint)),
    );
  };

  return screenMode !== ScreenTypes.DESKTOP ? (
    <CartSiderMobile
      createOnDeselectHandler={createOnDeselectHandler}
      onDeselectBulkHandler={onDeselectBulkHandler}
      swap={swap}
      isSwapButtonDisabled={isSwapButtonDisabled}
      isCartEmpty={isCartEmpty}
      cartItems={cartItems}
      invalidItems={invalidItems}
      itemsAmount={itemsAmount}
      totalBuy={totalBuy}
      totalSell={totalSell}
    />
  ) : (
    <CartSiderDesktop
      createOnDeselectHandler={createOnDeselectHandler}
      onDeselectBulkHandler={onDeselectBulkHandler}
      swap={swap}
      isSwapButtonDisabled={isSwapButtonDisabled}
      isCartEmpty={isCartEmpty}
      cartOpened={cartOpened}
      cartItems={cartItems}
      invalidItems={invalidItems}
      itemsAmount={itemsAmount}
      totalBuy={totalBuy}
      totalSell={totalSell}
      isExchangeMode={exchangeModalVisible}
    />
  );
};

export default memo(CartSider);
