import { FC } from 'react';
import { CloseOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Badge, Button, Layout, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartSiderVisible } from '../../state/common/selectors';
import { commonActions } from '../../state/common/actions';
import styles from './AppLayout.module.scss';
import {
  selectAllInvalidCartOrders,
  selectCartItems,
} from '../../state/core/selectors';
import solanaLogo from '../../assets/icons/svg/solana-sol-logo.svg';
import { formatBNToString } from '../../utils';
import BN from 'bn.js';
import { coreActions } from '../../state/core/actions';
import { CartOrder } from '../../state/core/types';
import { useSwap } from './hooks';
import classNames from 'classnames';
import { SolPrice } from '../SolPrice/SolPrice';

const { Sider } = Layout;

export const CartSider: FC = () => {
  const dispatch = useDispatch();
  const visible = useSelector(selectCartSiderVisible);
  const { swap } = useSwap();

  const cartItems = useSelector(selectCartItems);
  const invalidItems = useSelector(selectAllInvalidCartOrders);

  const itemsAmount = cartItems.buy.length + cartItems.sell.length;
  const isSwapButtonDisabled = !itemsAmount;

  const totalBuy = cartItems.buy.reduce((acc, item) => acc + item.price, 0);
  const totalSell = cartItems.sell.reduce((acc, item) => acc + item.price, 0);

  const createOnDeselectHandler = (order: CartOrder) => () => {
    dispatch(coreActions.removeOrderFromCart(order.mint));
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={!visible}
      className={styles.cartSider}
      collapsedWidth={0}
      width={320}
    >
      <Badge
        count={itemsAmount}
        className={styles.toggleCartSiderBtn}
        offset={[-40, 0]}
      >
        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          size={'large'}
          onClick={() => dispatch(commonActions.toggleCartSider())}
        />
      </Badge>
      <div className={styles.siderContent}>
        {!!cartItems.buy.length && (
          <div className={styles.cardsSection}>
            <div className={styles.cartTitle}>
              <Typography.Title level={4}>
                Buy {cartItems.buy.length} NFTs
              </Typography.Title>
              <Typography.Text>
                <SolPrice price={totalBuy} raw />
              </Typography.Text>
            </div>
            <div className={styles.cartItems}>
              {cartItems.buy.map((item) => (
                <SiderCart
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
          <div className={styles.cardsSection}>
            <div className={styles.cartTitle}>
              <Typography.Title level={4}>
                Sell {cartItems.sell.length} NFTs
              </Typography.Title>
              <Typography.Text>
                <SolPrice price={totalSell} raw />
              </Typography.Text>
            </div>
            <div className={styles.cartItems}>
              {cartItems.sell.map((item) => (
                <SiderCart
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
          <div className={styles.cardsSection}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography.Title level={4} style={{ marginBottom: 0 }}>
                Invalid {invalidItems.length} orders
              </Typography.Title>
              <Button
                size="small"
                onClick={() => dispatch(coreActions.clearInvalidOrders())}
              >
                Clear
              </Button>
            </div>
            <Typography.Text style={{ marginBottom: 10 }}>
              {
                "According blockchain changes, this orders aren't available anymore"
              }
            </Typography.Text>
            <div
              className={classNames(styles.cartItems, styles.cartItemsInvalid)}
            >
              {invalidItems.map((item) => (
                <SiderCart
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
            Swap
          </Button>
        </div>
      </div>
    </Sider>
  );
};

interface SiderCartProps {
  imageUrl: string;
  name: string;
  price: string;
  onDeselect?: () => void;
}

export const SiderCart: FC<SiderCartProps> = ({
  name,
  price,
  imageUrl,
  onDeselect,
}) => {
  return (
    <div className={styles.card}>
      <img className={styles.cardImage} src={imageUrl} alt={name} />
      <div className={styles.cardContent}>
        <Typography.Title level={5} className={styles.cardTitle}>
          {name}
        </Typography.Title>
        <Typography.Text className={styles.cardPrice}>
          <img width={16} height={16} src={solanaLogo} /> {price}
        </Typography.Text>
      </div>
      <div className={styles.btnWrapper}>
        {onDeselect && (
          <Button
            type="default"
            shape="default"
            icon={<CloseOutlined />}
            onClick={onDeselect}
          />
        )}
      </div>
    </div>
  );
};
