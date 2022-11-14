import { FC } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import CartSection from './components/CartSection';
import CartSectionInvalid from './components/CartSectionInvalid';
import Button from '../Buttons/Button';
import { CartSiderProps } from './index';

import styles from './styles.module.scss';

const CartSiderDesktop: FC<CartSiderProps> = ({
  createOnDeselectHandler,
  onDeselectBulkHandler,
  swap,
  isSwapButtonDisabled,
  cartOpened,
  cartItems,
  totalBuy,
  totalSell,
  invalidItems,
}) => {
  const dispatch = useDispatch();
  const titleBuy = `buy ${cartItems.buy.length} ${
    cartItems.buy.length > 1 ? 'NFTs' : 'NFT'
  }`;
  const titleSell = `sell ${cartItems.sell.length} nfts`;

  return (
    <div
      className={classNames(styles.cartSider, {
        [styles.openCart]: cartOpened,
      })}
    >
      <div className={styles.cartBody}>
        <CartSection
          title={titleBuy}
          cartItems={cartItems.buy}
          onDeselectBulkHandler={onDeselectBulkHandler}
          createOnDeselectHandler={createOnDeselectHandler}
          totalPrice={totalBuy}
        />
        <CartSection
          title={titleSell}
          cartItems={cartItems.sell}
          onDeselectBulkHandler={onDeselectBulkHandler}
          createOnDeselectHandler={createOnDeselectHandler}
          totalPrice={totalSell}
        />
        <CartSectionInvalid invalidItems={invalidItems} dispatch={dispatch} />
      </div>
      <div className={styles.submitWrapper}>
        <Button isDisabled={isSwapButtonDisabled} onClick={swap}>
          <span>swap</span>
        </Button>
        <Button outlined isDisabled={isSwapButtonDisabled} onClick={() => null}>
          <span>swap by credit card</span>
        </Button>
      </div>
    </div>
  );
};

export default CartSiderDesktop;
