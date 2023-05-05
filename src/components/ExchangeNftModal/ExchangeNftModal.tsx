import { FC, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CloseOutlined } from '@ant-design/icons';
import { Col, Modal, Row, Typography } from 'antd';
import { useParams } from 'react-router-dom';

import { CartOrder, MarketOrder, OrderType } from '../../state/core/types';
import solanaLogo from '../../assets/icons/svg/solana-sol-logo.svg';
import { NotifyInfoIcon } from '../../icons/NotifyInfoIcon';
import { getFormattedPrice } from '../../utils';
import { FakeInfinityScroll } from '../FakeInfiinityScroll';
import { coreActions } from '../../state/core/actions';
import styles from './ExchangeNftModal.module.scss';
import Card from '../CartSider/components/Card';
import { NFTCard } from '../NFTCard/NFTCard';
import { Spinner } from '../Spinner/Spinner';
import Button from '../Buttons/Button';
import {
  selectCartItems,
  selectCertainMarket,
  selectMarketPairs,
  selectMarketPairsLoading,
  selectMarketWalletNftsLoading,
  selectSellOrdersForExchange,
} from '../../state/core/selectors';
import { commonActions } from '../../state/common/actions';
import { useSwap } from '../CartSider/hooks';
import { formatRawSol } from '../../utils/solanaUtils';
import { useCalcNftRoyalty } from '../../hooks/useCalcNftRoyalty';

const { Title, Text } = Typography;

interface ExchangeNftModalProps {
  visible: boolean;
  onCancel: () => void;
  selectedBuyOrder: CartOrder;
}

const ExchangeNftModal: FC<ExchangeNftModalProps> = ({
  visible,
  onCancel,
  selectedBuyOrder,
}) => {
  const dispatch = useDispatch();
  const { publicKey: marketPublicKey } = useParams<{ publicKey: string }>();

  const market = useSelector(selectCertainMarket);
  const sellOrders = useSelector((state: never) =>
    selectSellOrdersForExchange(state, marketPublicKey),
  );

  const [selectedOrder, setSelectedOrder] = useState<CartOrder>();

  const marketPairsLoading = useSelector(selectMarketPairsLoading);
  const nftsLoading = useSelector(selectMarketWalletNftsLoading);

  const cartItems = useSelector(selectCartItems);
  const pairs = useSelector(selectMarketPairs);

  const selectedBuyNft = cartItems?.buy[0] || selectedBuyOrder;
  const selectedSellOrder = cartItems?.sell[0];

  const { swap } = useSwap({
    ixsPerTxn: 1,
    onSuccessTxn: () =>
      dispatch(commonActions.setExchangeModal({ isVisible: false })),
  });

  const isLoading = nftsLoading || marketPairsLoading;

  const buyNftPrice = parseFloat(getFormattedPrice(selectedBuyNft?.price));
  const sellNftPrice = parseFloat(getFormattedPrice(selectedSellOrder?.price));
  const royalty = useCalcNftRoyalty({
    nftPrice: selectedBuyOrder?.price,
    royaltyPercent: market?.royaltyPercent,
  });

  console.log({
    selectedBuyNft,
    selectedSellOrder,
  });

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

  const closeExchangeModal = (): void => {
    onCancel();
    setSelectedOrder(null);
  };

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

      dispatch(
        coreActions.addOrderToCart(
          pairs.find(
            (pair) => pair.pairPubkey === selectedBuyOrder.targetPairPukey,
          ),
          selectedBuyOrder,
          OrderType.BUY,
        ),
      );
    },
    [dispatch, cartItems, pairs, selectedSellOrder, selectedBuyOrder, onSelect],
  );

  const createDeselectHandler = (order: CartOrder) => () => {
    dispatch(coreActions.removeOrderFromCart(order.mint));
    closeExchangeModal();
  };

  console.log('selectedBuyOrder ', selectedBuyOrder?.royaltyPercent);

  return (
    <Modal
      visible={visible}
      footer={null}
      centered
      closable
      closeIcon={<CloseOutlined />}
      onCancel={closeExchangeModal}
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
              rarity={order.rarity}
              onCardClick={addSellOrderToExchange(order)}
              withoutAddToCartBtn
              isPnft={market.isPnft}
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
          name={`#${selectedBuyNft?.name?.split('#')[1]}`}
          imageUrl={selectedBuyNft?.imageUrl}
          price={selectedBuyNft?.price}
          rarity={selectedBuyNft?.rarity}
          onDeselect={createDeselectHandler(selectedBuyNft)}
        />
      </Col>
      <div className={styles.priceBlock}>
        <Row className={styles.priceDifference} justify="space-between">
          <Text className={styles.text}>price difference</Text>
          <Row align="middle" style={{ gap: 5 }}>
            <Text className={styles.value}>{priceDifference.toFixed(2)}</Text>
            <img className={styles.solLogo} src={solanaLogo} alt="sol" />
          </Row>
        </Row>
        <Row className={styles.priceDifference} justify="space-between">
          <Text className={styles.text}>pnft royalty</Text>
          <Row align="middle" style={{ gap: 5 }}>
            <Text className={styles.value}>
              {formatRawSol(royalty.toNumber())}
            </Text>
            <img className={styles.solLogo} src={solanaLogo} alt="sol" />
          </Row>
        </Row>
      </div>
      <div className={styles.notifyBlock}>
        <div className={styles.notifyItem}>
          <NotifyInfoIcon />
          <span>price difference may change</span>
        </div>
        <div className={styles.notifyItem}>
          <NotifyInfoIcon />
          <span>
            make sure you know swap consists of sell and buy transactions
          </span>
        </div>
      </div>
      <Button isDisabled={isDisabled} className={styles.btn} onClick={swap}>
        <span>
          exchange for{' '}
          {(priceDifference + Number(formatRawSol(royalty.toNumber()))).toFixed(
            2,
          )}{' '}
          SOL
        </span>
      </Button>
    </Modal>
  );
};

export default ExchangeNftModal;
