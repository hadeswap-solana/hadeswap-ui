import { FC } from 'react';
import { CloseOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Badge, Button, Layout, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartSiderVisible } from '../../state/common/selectors';
import { commonActions } from '../../state/common/actions';
import styles from './AppLayout.module.scss';
import { selectCartItems } from '../../state/core/selectors';
import solanaLogo from '../../assets/icons/svg/solana-sol-logo.svg';
import { formatBNToString } from '../../utils';
import BN from 'bn.js';
import { CartNft } from '../../state/core/actions/cartActions';
import { coreActions } from '../../state/core/actions';

const { Sider } = Layout;

export const CartSider: FC = () => {
  const dispatch = useDispatch();
  const visible = useSelector(selectCartSiderVisible);

  const cartItems = useSelector(selectCartItems);

  const itemsAmount = cartItems.buy.length + cartItems.sell.length;

  const createOnDeselectHandler =
    (order: CartNft, isSell = false) =>
    () => {
      isSell
        ? dispatch(coreActions.removeSellItem(order.pair, order.mint))
        : dispatch(coreActions.removeBuyItem(order.pair, order.mint));
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
                onDeselect={createOnDeselectHandler(item, true)}
              />
            ))}
          </div>
        )}

        <div className={styles.submitWrapper}>
          <Button type="primary" block size="large">
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
