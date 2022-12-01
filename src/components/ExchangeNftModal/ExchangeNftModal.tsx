import { FC, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CloseOutlined } from '@ant-design/icons';
import { Typography, Modal, Col, Row } from 'antd';
import { useParams } from 'react-router-dom';
import BN from 'bn.js';

import { txsLoadingModalActions } from '../../state/txsLoadingModal/actions';
import { CartOrder, MarketOrder, OrderType } from '../../state/core/types';
import solanaLogo from '../../assets/icons/svg/solana-sol-logo.svg';
import { formatBNToString, getFormattedPrice } from '../../utils';
import { FakeInfinityScroll } from '../FakeInfiinityScroll';
import { coreActions } from '../../state/core/actions';
import styles from './ExchangeNftModal.module.scss';
import Card from '../CartSider/components/Card';
import { NFTCard } from '../NFTCard/NFTCard';
import { Spinner } from '../Spinner/Spinner';
import Button from '../Buttons/Button';
import { useExchange } from './hooks';
import {
  selectCartItems,
  selectMarketPairs,
  selectMarketPairsLoading,
  selectMarketWalletNftsLoading,
  selectSellOrdersForExchange,
} from '../../state/core/selectors';
import { commonActions } from '../../state/common/actions';

const { Title, Text } = Typography;

interface ExchangeNftModalProps {
  visible: boolean;
  onCancel: () => void;
}

const ExchangeNftModal: FC<ExchangeNftModalProps> = ({ visible, onCancel }) => {
  const dispatch = useDispatch();

  const { publicKey: marketPublicKey } = useParams<{ publicKey: string }>();
  const sellOrders = useSelector((state: never) =>
    selectSellOrdersForExchange(state, marketPublicKey),
  );

  const [selectedOrder, setSelectedOrder] = useState<CartOrder>(null);

  const marketPairsLoading = useSelector(selectMarketPairsLoading);
  const nftsLoading = useSelector(selectMarketWalletNftsLoading);

  const cartItems = useSelector(selectCartItems);
  const pairs = useSelector(selectMarketPairs);

  const selectedBuyNft = cartItems?.buy[0];
  const selectedSellOrder = cartItems?.sell[0];

  const onAfterTxn = (): void => {
    dispatch(txsLoadingModalActions.setVisible(false));
    dispatch(commonActions.setCartSider({ isVisible: false }));
  };

  const { swap } = useExchange(onAfterTxn);

  const isLoading = nftsLoading || marketPairsLoading;

  const buyNftPrice = parseFloat(getFormattedPrice(selectedBuyNft?.price));
  const sellNftPrice = parseFloat(getFormattedPrice(selectedSellOrder?.price));

  const priceDifference =
    (selectedOrder?.mint && buyNftPrice - sellNftPrice) || 0;
  const isDisabled = !selectedBuyNft || !selectedOrder?.mint;

  const onSelect = useCallback(
    (order: CartOrder): void => {
      selectedOrder?.mint === order.mint
        ? setSelectedOrder(null)
        : setSelectedOrder(order);
    },
    [selectedOrder],
  );

  const addSellOrderToExchange = useCallback(
    (order: MarketOrder) => () => {
      const orderIsExist = cartItems?.sell.length;
      onSelect(order);

      if (orderIsExist) {
        return dispatch(
          coreActions.replaceBuyOrder(
            selectedSellOrder.targetPairPukey,
            selectedSellOrder.mint,
            order,
          ),
        );
      }
      dispatch(
        coreActions.addOrderToCart(
          pairs.find((pair) => pair.pairPubkey === order?.targetPairPukey),
          order,
          OrderType.SELL,
        ),
      );
    },
    [dispatch, cartItems, pairs, selectedSellOrder, onSelect],
  );

  const createDeselectHandler = (order: CartOrder) => () => {
    dispatch(coreActions.removeOrderFromCart(order.mint));
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      footer={null}
      centered
      closable
      closeIcon={<CloseOutlined />}
      onCancel={onCancel}
      width={495}
      destroyOnClose
    >
      <Title level={4}>select NFT to exchange</Title>
      {isLoading && <Spinner />}
      {!isLoading && !!sellOrders.length && (
        <FakeInfinityScroll itemsPerScroll={12} className={styles.nftList}>
          {sellOrders.map((order) => (
            <NFTCard
              key={order.mint}
              imageUrl={order.imageUrl}
              name={order.name}
              price={getFormattedPrice(order.price)}
              selected={selectedOrder?.mint === order.mint}
              disabled={order.disabled}
              onCardClick={addSellOrderToExchange(order)}
              withoutAddToCartBtn
            />
          ))}
        </FakeInfinityScroll>
      )}
      {!sellOrders?.length && !isLoading && (
        <Title level={5}>no nfts of this collections</Title>
      )}
      <Col className={styles.cardWrapper}>
        <p className={styles.cardLabel}>you’ll get</p>
        <Card
          key={selectedBuyNft?.mint}
          name={selectedBuyNft?.name}
          imageUrl={selectedBuyNft?.imageUrl}
          price={formatBNToString(new BN(selectedBuyNft?.price))}
          onDeselect={createDeselectHandler(selectedBuyNft)}
        />
      </Col>

      <Row style={{ marginTop: 32 }} justify="space-between">
        <Text className={styles.priceDifference}>price difference</Text>
        <Row align="middle" style={{ gap: 5 }}>
          <Text>{priceDifference.toFixed(2)}</Text>
          <img width={12} height={12} src={solanaLogo} alt="sol" />
        </Row>
      </Row>
      <Button isDisabled={isDisabled} className={styles.btn} onClick={swap}>
        <span>exchange for {priceDifference.toFixed(2)} SOL</span>
      </Button>
    </Modal>
  );
};

export default ExchangeNftModal;
