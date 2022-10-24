import { FC, memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectScreeMode } from '../../state/common/selectors';
import CartSiderDesktop from './CartSider';
import CartSiderMobile from './mobile/CartSider';
import { useCartSider, useSwap } from './hooks';
import styles from './mobile/CartSider.module.scss';
import { ScreenTypes } from '../../state/common/types';
import { CartOrder } from '../../state/core/types';
import { coreActions } from '../../state/core/actions';

export interface CartSiderProps {
  createOnDeselectHandler?: (arg) => () => void;
  dispatch?: (arg) => void;
  swap?: () => Promise<void>;
  setShowModal?: () => void;
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

  return screenMode === ScreenTypes.TABLET ? (
    visible && (
      <CartSiderMobile
        createOnDeselectHandler={createOnDeselectHandler}
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
        stopScroll={isHeaderVisible && showModal}
      />
    )
  ) : (
    <CartSiderDesktop
      createOnDeselectHandler={createOnDeselectHandler}
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

export default memo(CartSider);
