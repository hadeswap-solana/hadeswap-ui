import { FC } from 'react';
import { useDispatch } from 'react-redux';
import withModal from '../../Modal/mobile/Modal';
import { CartSiderProps } from '../index';
import BadgeButton from '../../Buttons/BadgeButton';
import CartSection from '../components/CartSection';
import CartSectionInvalid from '../components/CartSectionInvalid';
import Button from '../../Buttons/Button';

import styles from './styles.module.scss';

const CartSiderMobile: FC<CartSiderProps> = (props) => {
  const dispatch = useDispatch();

  const {
    createOnDeselectHandler,
    onDeselectBulkHandler,
    swap,
    setShowModal,
    cartItems,
    itemsAmount,
    isSwapButtonDisabled,
    totalBuy,
    totalSell,
    invalidItems,
  } = props;

  return (
    <div className={styles.cartInner}>
      <div className={styles.badgeButtonWrapper}>
        <BadgeButton
          btnClassName={styles.badgeButton}
          onClick={() => setShowModal((value: boolean) => !value)}
          itemsAmount={itemsAmount}
        />
      </div>
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

export default withModal(CartSiderMobile);
