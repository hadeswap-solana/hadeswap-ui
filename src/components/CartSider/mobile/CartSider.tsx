import { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import Modal from '../../Modal/mobile/Modal';
import BadgeButton from '../../Buttons/BadgeButton';
import CartSection from '../components/CartSection';
import CartSectionInvalid from '../components/CartSectionInvalid';
import Button from '../../Buttons/Button';
import { CrossmintButton } from '../components/CrossmintButton';
import { CartSiderProps } from '../index';

import styles from './styles.module.scss';
import SwapExchangeButton from '../components/SwapExchangeButton';

const HEADER_HEIGHT = 56;

const CartSiderMobile: FC<CartSiderProps> = ({
  createOnDeselectHandler,
  onDeselectBulkHandler,
  swap,
  isSwapButtonDisabled,
  isCartEmpty,
  cartItems,
  invalidItems,
  itemsAmount,
  totalBuy,
  totalSell,
  isOneBuyNft,
  crossmintConfig,
  exchangeToken,
}) => {
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState<boolean>(null);

  const isHeaderVisible = window.scrollY < HEADER_HEIGHT;

  const onShowModalClick = () => {
    setShowModal((value: boolean) => !value);
  };

  return (
    <>
      {!isCartEmpty && (
        <Modal
          className={classNames(
            { [styles.pocketModal]: !isCartEmpty },
            { [styles.showModalToHeader]: showModal && isHeaderVisible },
            { [styles.showModalToTop]: showModal && !isHeaderVisible },
            {
              [styles.hideModalfromHeader]:
                showModal === false && isHeaderVisible,
            },
            {
              [styles.hideModalfromTop]:
                showModal === false && !isHeaderVisible,
            },
          )}
          stopScroll={showModal}
          scrollToTop={false}
        >
          <div className={styles.cartInner}>
            <div className={styles.badgeButtonWrapper}>
              <BadgeButton
                btnClassName={styles.badgeButton}
                onClick={onShowModalClick}
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
              <CartSectionInvalid
                invalidItems={invalidItems}
                dispatch={dispatch}
              />
            </div>
            <div className={styles.submitWrapper}>
              {exchangeToken && (
                <SwapExchangeButton
                  rawSolAmount={totalBuy}
                  inputToken={exchangeToken}
                  swap={swap}
                />
              )}
              {!exchangeToken && (
                <Button isDisabled={isSwapButtonDisabled} onClick={swap}>
                  <span>swap</span>
                </Button>
              )}
              <CrossmintButton
                isOneBuyNft={isOneBuyNft}
                crossmintConfig={crossmintConfig}
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default CartSiderMobile;
