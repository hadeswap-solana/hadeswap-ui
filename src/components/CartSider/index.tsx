import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectScreeMode } from '../../state/common/selectors';
import CartSiderDesktop from './CartSider';
import CartSiderMobile from './mobile/CartSider';
import { useCartSider, useSwap } from './hooks';
import { ScreenTypes } from '../../state/common/types';
import { CartOrder } from '../../state/core/types';
import { coreActions } from '../../state/core/actions';

import styles from './mobile/styles.module.scss';

export interface CartSiderProps {
  createOnDeselectHandler?: (arg: CartOrder) => () => void;
  onDeselectBulkHandler?: (arg: CartOrder[]) => void;
  dispatch?: (arg) => void;
  swap?: () => Promise<void>;
  setShowModal?: (arg: (value: boolean) => boolean) => void;
  itemsAmount: number;
  isSwapButtonDisabled?: boolean;
  isCartEmpty: boolean;
  cartOpened: boolean;
  cartItems: {
    buy?: CartOrder[];
    sell?: CartOrder[];
  };
  totalBuy: number;
  totalSell: number;
  invalidItems: CartOrder[];
}

const HEADER_HEIGHT = 56;

const CartSider: FC = () => {
  const dispatch = useDispatch();
  const screenMode = useSelector(selectScreeMode);

  const [visible, setVisible] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean | null>(null);
  const [modalClassName, setModalClassName] = useState<string>('');

  const {
    cartItems,
    cartOpened,
    isCartEmpty,
    invalidItems,
    itemsAmount,
    totalBuy,
    totalSell,
  } = useCartSider();

  const isHeaderVisible = window.scrollY < HEADER_HEIGHT;
  const isSwapButtonDisabled = !itemsAmount;

  const { swap } = useSwap();

  const createOnDeselectHandler = (order: CartOrder) => () => {
    dispatch(coreActions.removeOrderFromCart(order.mint));
  };

  const onDeselectBulkHandler = (data) => {
    data.forEach((item) =>
      dispatch(coreActions.removeOrderFromCart(item.mint)),
    );
  };

  useEffect(() => {
    if (!isCartEmpty && !visible) {
      setModalClassName(styles.pocketModal);
      setVisible(true);
    }

    if (isCartEmpty) {
      setVisible(false);
      setShowModal(null);
    }

    if (showModal !== null) {
      if (showModal) {
        isHeaderVisible
          ? setModalClassName(styles.showModalToHeader)
          : setModalClassName(styles.showModalToTop);
      }

      if (!showModal) {
        isHeaderVisible
          ? setModalClassName(
              `${styles.pocketModal} ${styles.hideModalfromHeader}`,
            )
          : setModalClassName(
              `${styles.pocketModal} ${styles.hideModalfromTop}`,
            );
      }
    }
  }, [isCartEmpty, visible, showModal, isHeaderVisible]);

  return screenMode !== ScreenTypes.DESKTOP ? (
    visible && (
      <CartSiderMobile
        createOnDeselectHandler={createOnDeselectHandler}
        onDeselectBulkHandler={onDeselectBulkHandler}
        cartItems={cartItems}
        invalidItems={invalidItems}
        dispatch={dispatch}
        swap={swap}
        cartOpened={cartOpened}
        isCartEmpty={isCartEmpty}
        setShowModal={setShowModal}
        modalClassName={modalClassName}
        itemsAmount={itemsAmount}
        isSwapButtonDisabled={isSwapButtonDisabled}
        totalBuy={totalBuy}
        totalSell={totalSell}
        stopScroll={showModal}
        scrollToTop={showModal && isHeaderVisible}
      />
    )
  ) : (
    <CartSiderDesktop
      createOnDeselectHandler={createOnDeselectHandler}
      onDeselectBulkHandler={onDeselectBulkHandler}
      cartItems={cartItems}
      invalidItems={invalidItems}
      dispatch={dispatch}
      swap={swap}
      itemsAmount={itemsAmount}
      isSwapButtonDisabled={isSwapButtonDisabled}
      isCartEmpty={isCartEmpty}
      cartOpened={cartOpened}
      totalBuy={totalBuy}
      totalSell={totalSell}
    />
  );
};

export default CartSider;
