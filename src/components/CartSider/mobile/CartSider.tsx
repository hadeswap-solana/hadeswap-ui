import { FC } from 'react';
import BadgeButton from '../components/BadgeButton';
import Card from '../components/Card';
import withModal from '../../Modal/mobile/Modal';
import classNames from 'classnames';
import { formatBNToString } from '../../../utils';
import BN from 'bn.js';
import { CartSiderProps } from '../index';
import { SolPrice } from '../../SolPrice/SolPrice';
import { Button } from 'antd';
import { coreActions } from '../../../state/core/actions';
import styles from './CartSider.module.scss';

const CartSiderMobile: FC<CartSiderProps> = (props) => {
  const {
    createOnDeselectHandler,
    dispatch,
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
    <div className={styles.modalInner}>
      <div className={styles.main}>
        <BadgeButton
          setShowModal={setShowModal}
          dispatch={dispatch}
          itemsAmount={itemsAmount}
          className={styles.badgeButtonWrapper}
        />
        {!!cartItems.buy.length && (
          <div className={styles.section}>
            <div className={styles.header}>
              <span className={styles.headerTitle}>
                buy {cartItems.buy.length}{' '}
                {cartItems.buy.length > 1 ? 'NFTs' : 'NFT'}
              </span>
              <SolPrice className={styles.headerPrice} price={totalBuy} raw />
            </div>
            <div className={styles.content}>
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
          <div className={styles.section}>
            <div className={styles.header}>
              <span className={styles.headerTitle}>
                sell&nbsp;{cartItems.sell.length}&nbsp;nfts
              </span>
              <SolPrice className={styles.headerPrice} price={totalSell} raw />
            </div>
            <div className={styles.content}>
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
          <div className={styles.section}>
            <div className={styles.header}>
              <span className={styles.headerTitle}>
                invalid&nbsp;{invalidItems.length}&nbsp;orders
              </span>
              <Button
                size="small"
                onClick={() => dispatch(coreActions.clearInvalidOrders())}
              >
                clear
              </Button>
            </div>
            <p className={styles.headerSubTitle}>
              {
                "according blockchain changes, this orders aren't available anymore"
              }
            </p>
            <div className={classNames(styles.content, styles.invalid)}>
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
      </div>
      <Button
        disabled={isSwapButtonDisabled}
        type="primary"
        block
        size="large"
        onClick={swap}
        className={styles.swapButton}
      >
        swap
      </Button>
    </div>
  );
};

export default withModal(CartSiderMobile);
