import { FC } from 'react';
import { CloseOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Badge, Button, Layout, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartSiderVisible } from '../../state/common/selectors';
import { commonActions } from '../../state/common/actions';
import styles from './AppLayout.module.scss';
import {
  selectCartItems,
  selectCartOrders,
  selectCartPairs,
} from '../../state/core/selectors';
import solanaLogo from '../../assets/icons/svg/solana-sol-logo.svg';
import { formatBNToString } from '../../utils';
import BN from 'bn.js';
import { coreActions } from '../../state/core/actions';
import { CartOrder } from '../../state/core/types';
import { chunk } from 'lodash';
import { useConnection } from '../../hooks';
import { useWallet } from '@solana/wallet-adapter-react';
import { createIx, mergeIxsIntoTxn, signTransactionsInSeries } from './helpers';

const { Sider } = Layout;

const useSwap = () => {
  const IX_PER_TXN = 3;

  const connection = useConnection();
  const wallet = useWallet();

  const orders = useSelector(selectCartOrders);
  const pairs = useSelector(selectCartPairs);

  const onSwap = async () => {
    const ordersArray = Object.values(orders).flat();

    const ixsAndSigners = await Promise.all(
      ordersArray.map((order) =>
        createIx({
          connection,
          walletPubkey: wallet.publicKey,
          pair: pairs[order.targetPairPukey],
          order,
        }),
      ),
    );

    const ixsAndSignersChunks = chunk(ixsAndSigners, IX_PER_TXN);

    const txnAndSigners = ixsAndSignersChunks.map((ixsAndSigners) =>
      mergeIxsIntoTxn(ixsAndSigners),
    );

    await signTransactionsInSeries({
      txnAndSigners,
      connection,
      wallet,
    });
  };

  return {
    onSwap,
  };
};

export const CartSider: FC = () => {
  const dispatch = useDispatch();
  const visible = useSelector(selectCartSiderVisible);
  const { onSwap } = useSwap();

  const cartItems = useSelector(selectCartItems);

  const itemsAmount = cartItems.buy.length + cartItems.sell.length;

  const createOnDeselectHandler = (order: CartOrder) => () => {
    dispatch(coreActions.removeOrder(order.mint));
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
            <Typography.Title level={4}>
              Buy {cartItems.buy.length} NFTs
            </Typography.Title>
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
        )}
        {!!cartItems.sell.length && (
          <div className={styles.cardsSection}>
            <Typography.Title level={4}>
              Sell {cartItems.sell.length} NFTs
            </Typography.Title>
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
        )}

        <div className={styles.submitWrapper}>
          <Button type="primary" block size="large" onClick={onSwap}>
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

const SiderCart: FC<SiderCartProps> = ({
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
        <Button
          type="default"
          shape="default"
          icon={<CloseOutlined />}
          onClick={onDeselect}
        />
      </div>
    </div>
  );
};
