import { FC } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import CartSection from './components/CartSection';
import CartSectionInvalid from './components/CartSectionInvalid';
import Button from '../Buttons/Button';
import { CrossmintButton } from './components/CrossmintButton';
import SwapExchangeButton from './components/SwapExchangeButton';
import { useExchangeData } from './hooks';
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
  isExchangeMode,
  isOneBuyNft,
  crossmintConfig,
}) => {
  const dispatch = useDispatch();

  const {
    amount,
    tokenFormattedAmount,
    tokenExchange,
    rate,
    exchangeLoading,
    exchangeFetching,
  } = useExchangeData({ rawSolAmount: totalBuy });

  const titleBuy = `buy ${cartItems.buy.length}`;
  const titleSell = `sell ${cartItems.sell.length}`;

  return (
    <div
      className={classNames(styles.cartSider, {
        [styles.openCart]: !isExchangeMode && cartOpened,
      })}
    >
      <div className={styles.cartBody}>
        <CartSection
          title={titleBuy}
          cartItems={cartItems.buy}
          onDeselectBulkHandler={onDeselectBulkHandler}
          createOnDeselectHandler={createOnDeselectHandler}
          totalPrice={totalBuy}
          tokenExchange={tokenExchange}
          tokenRate={rate}
          tokenFormattedAmount={tokenFormattedAmount}
          tokenLoading={exchangeLoading || exchangeFetching}
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
        {!!tokenExchange && (
          <SwapExchangeButton
            rawSolAmount={totalBuy}
            inputToken={tokenExchange}
            tokenFormattedAmount={tokenFormattedAmount}
            swap={swap}
            amount={amount}
            exchangeLoading={exchangeLoading}
            exchangeFetching={exchangeFetching}
          />
        )}
        {!tokenExchange && (
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
  );
};

export default CartSiderDesktop;
