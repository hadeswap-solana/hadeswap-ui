import { FC } from 'react';
import { Button, Typography } from 'antd';
import BN from 'bn.js';
import classNames from 'classnames';

import { coreActions } from '../../state/core/actions';
import { formatBNToString } from '../../utils';
import { SolPrice } from '../SolPrice/SolPrice';
import Card from './components/Card';
import BadgeButton from './components/BadgeButton';
import { CartSiderProps } from './index';
import styles from './CartSider.module.scss';

const CartSiderDesktop: FC<CartSiderProps> = ({
  createOnDeselectHandler,
  dispatch,
  swap,
  itemsAmount,
  isSwapButtonDisabled,
  isCartEmpty,
  cartOpened,
  cartItems,
  totalBuy,
  totalSell,
  invalidItems,
}) => {
  const badgeClassName = classNames(styles.toggleCartSiderBtn, {
    [styles.toggleCartSiderBtnHidden]: isCartEmpty,
  });

  return (
    <div
      className={classNames(styles.cartSider, {
        [styles.openCart]: cartOpened,
      })}
    >
      <BadgeButton
        dispatch={dispatch}
        itemsAmount={itemsAmount}
        className={badgeClassName}
      />
      <div
        className={classNames(styles.cartBody, {
          [styles.expandBody]: cartOpened,
        })}
      >
        {!!cartItems.buy.length && (
          <div className={styles.cartSection}>
            <div className={styles.cartTitle}>
              <Typography.Title level={4}>
                buy {cartItems.buy.length}{' '}
                {cartItems.buy.length > 1 ? 'NFTs' : 'NFT'}
              </Typography.Title>
              <Typography.Text>
                <SolPrice price={totalBuy} raw />
              </Typography.Text>
            </div>
            <div className={styles.cartItems}>
              {cartItems.buy.map((item) => (
                <Card
                  key={item.mint}
                  name={item.name}
                  imageUrl={item.imageUrl}
                  price={formatBNToString(new BN(item.price))}
                  onDeselect={createOnDeselectHandler(item)}
                />
              ))}
            </div>
          </div>
        )}
        {!!cartItems.sell.length && (
          <div className={styles.cartSection}>
            <div className={styles.cartTitle}>
              <Typography.Title level={4}>
                sell&nbsp;{cartItems.sell.length}&nbsp;nfts
              </Typography.Title>
              <Typography.Text>
                <SolPrice price={totalSell} raw />
              </Typography.Text>
            </div>
            <div className={styles.cartItems}>
              {cartItems.sell.map((item) => (
                <Card
                  key={item.mint}
                  name={item.name}
                  imageUrl={item.imageUrl}
                  price={formatBNToString(new BN(item.price))}
                  onDeselect={createOnDeselectHandler(item)}
                />
              ))}
            </div>
          </div>
        )}

        {!!invalidItems.length && (
          <div className={styles.cartSection}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography.Title level={4} style={{ marginBottom: 0 }}>
                invalid&nbsp;{invalidItems.length}&nbsp;orders
              </Typography.Title>
              <Button
                size="small"
                onClick={() => dispatch(coreActions.clearInvalidOrders())}
              >
                clear
              </Button>
            </div>
            <Typography.Text style={{ marginBottom: 10 }}>
              {
                "according blockchain changes, this orders aren't available anymore"
              }
            </Typography.Text>
            <div
              className={classNames(styles.cartItems, styles.cartItemsInvalid)}
            >
              {invalidItems.map((item) => (
                <Card
                  key={item.mint}
                  name={item.name}
                  imageUrl={item.imageUrl}
                  price={formatBNToString(new BN(item.price))}
                />
              ))}
            </div>
          </div>
        )}
        <div className={styles.submitWrapper}>
          <Button
            disabled={isSwapButtonDisabled}
            type="primary"
            block
            size="large"
            onClick={swap}
          >
            swap
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartSiderDesktop;
