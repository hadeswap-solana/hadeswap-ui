import { FC, useCallback, useState } from 'react';
import BN from 'bn.js';
import { useDispatch, useSelector } from 'react-redux';
// import { SweepButton } from '../SweepButton';
import { NFTCard } from '../../../../components/NFTCard/NFTCard';
import { Spinner } from '../../../../components/Spinner/Spinner';
import { FakeInfinityScroll } from '../../../../components/FakeInfiinityScroll';
import {
  selectAllBuyOrdersForMarket,
  selectCartItems,
  selectMarketPairs,
  selectMarketPairsLoading,
} from '../../../../state/core/selectors';
import { coreActions } from '../../../../state/core/actions';
import { formatBNToString } from '../../../../utils';
import {
  CartOrder,
  MarketOrder,
  OrderType,
} from '../../../../state/core/types';

import styles from './styles.module.scss';
import ExchangeNftModal, {
  useExchangeModal,
} from '../../../../components/ExchangeNftModal';
import { commonActions } from '../../../../state/common/actions';

export const CollectionBuyTab: FC = () => {
  const dispatch = useDispatch();

  const marketPairsLoading = useSelector(selectMarketPairsLoading);
  const marketPairs = useSelector(selectMarketPairs);
  const buyOrders = useSelector(selectAllBuyOrdersForMarket);
  const cartItems = useSelector(selectCartItems);
  const [selectedBuyOrder, setSelectedBuyOrder] = useState<CartOrder>(null);

  const createOnBtnClick = useCallback(
    (order: MarketOrder) => () => {
      order?.selected
        ? dispatch(coreActions.removeOrderFromCart(order.mint))
        : dispatch(
            coreActions.addOrderToCart(
              marketPairs.find(
                (pair) => pair.pairPubkey === order.targetPairPukey,
              ),
              order,
              OrderType.BUY,
            ),
          );
    },
    [dispatch, marketPairs],
  );

  const {
    visible: exchangeModalVisible,
    open: openExchangeModal,
    close: closeExchangeModal,
  } = useExchangeModal();

  const onCancelExchangeModal = (): void => {
    closeExchangeModal();
    dispatch(commonActions.setCartSider({ isVisible: false }));
    dispatch(coreActions.clearCart());
  };

  const addBuyOrderToExchange = useCallback(
    (order: MarketOrder) => () => {
      const buyOrdersExists = !!cartItems?.buy.length;
      const sellOrdersExists = !!cartItems?.sell.length;

      if (buyOrdersExists || sellOrdersExists) {
        dispatch(coreActions.clearCart());
      }

      openExchangeModal();

      setSelectedBuyOrder(order);
    },
    [dispatch, cartItems, openExchangeModal],
  );

  return (
    <div className={styles.tabContentWrapper}>
      {marketPairsLoading ? (
        <Spinner />
      ) : (
        <>
          {/* <SweepButton /> */}
          <FakeInfinityScroll itemsPerScroll={21} className={styles.cards}>
            {buyOrders.map((order) => (
              <NFTCard
                key={order.mint}
                imageUrl={order.imageUrl}
                name={order.name}
                price={formatBNToString(new BN(order.price))}
                onCardClick={createOnBtnClick(order)}
                selected={order?.selected}
                onExchange={addBuyOrderToExchange(order)}
                rarity={order.rarity}
              />
            ))}
          </FakeInfinityScroll>
        </>
      )}
      <ExchangeNftModal
        visible={exchangeModalVisible}
        onCancel={onCancelExchangeModal}
        selectedBuyOrder={selectedBuyOrder}
      />
    </div>
  );
};
