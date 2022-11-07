import { FC, useRef, useEffect } from 'react';
import classNames from 'classnames';
import CartSection from './components/CartSection';
import CartSectionInvalid from './components/CartSectionInvalid';
import Button from '../Buttons/Button';
import { CartSiderProps } from './index';

import styles from './styles.module.scss';

const CartSiderDesktop: FC<CartSiderProps> = ({
  createOnDeselectHandler,
  onDeselectBulkHandler,
  dispatch,
  swap,
  isSwapButtonDisabled,
  cartOpened,
  cartItems,
  totalBuy,
  totalSell,
  invalidItems,
}) => {
  const HEADER_HEIGHT = 97;
  const cartRef = useRef(null);

  const setHeight = () => {
    if (window.scrollY < HEADER_HEIGHT) {
      cartRef.current &&
        (cartRef.current.style.height = `${
          document.documentElement.clientHeight - HEADER_HEIGHT + window.scrollY
        }px`);
    } else {
      cartRef.current?.style.height && (cartRef.current.style.height = null);
    }
  };

  useEffect(() => {
    setHeight();
    window.addEventListener('scroll', setHeight);
    return () => {
      window.removeEventListener('scroll', setHeight);
    };
  }, []);

  return (
    <div
      ref={cartRef}
      className={classNames(styles.cartSider, {
        [styles.openCart]: cartOpened,
      })}
    >
      <div className={styles.cartBody}>
        <CartSection
          title={`buy ${cartItems.buy.length} ${
            cartItems.buy.length > 1 ? 'NFTs' : 'NFT'
          }`}
          cartItems={cartItems.buy}
          onDeselectBulkHandler={onDeselectBulkHandler}
          createOnDeselectHandler={createOnDeselectHandler}
          totalPrice={totalBuy}
        />
        <CartSection
          title={`sell ${cartItems.sell.length} nfts`}
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
