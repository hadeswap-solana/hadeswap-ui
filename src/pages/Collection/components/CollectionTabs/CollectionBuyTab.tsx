import { FC, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BN from 'bn.js';
import { NFTCard } from '../../../../components/NFTCard/NFTCard';
import { Spinner } from '../../../../components/Spinner/Spinner';
import { FakeInfinityScroll } from '../../../../components/FakeInfiinityScroll';
import {
  selectAllBuyOrdersForMarket,
  selectCartItems,
  selectCertainMarket,
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
import ExchangeNftModal, {
  useExchangeModal,
} from '../../../../components/ExchangeNftModal';
import { commonActions } from '../../../../state/common/actions';
import { useOrdersSort } from '../SortOrders/hooks/useOrdersSort';
import SortOrdersControll from '../SortOrders/SortOrdersControll';

import styles from './styles.module.scss';

export const CollectionBuyTab: FC = () => {
  const dispatch = useDispatch();

  const market = useSelector(selectCertainMarket);
  const marketPairsLoading = useSelector(selectMarketPairsLoading);
  const marketPairs = useSelector(selectMarketPairs);
  const buyOrders = useSelector(selectAllBuyOrdersForMarket);
  const cartItems = useSelector(selectCartItems);
  const [selectedBuyOrder, setSelectedBuyOrder] = useState<CartOrder>(null);

  const { sortedOrders, sort, control, setValue, options, optionsMobile } =
    useOrdersSort({
      orders: buyOrders,
    });

  const createOnBtnClick = useCallback(
    (order: MarketOrder) => () => {
      const updatedOrder = {
        ...order,
        isPnft: market?.isPnft,
        royaltyPercent: market?.royaltyPercent,
        market: market.marketPubkey,
      };

      updatedOrder?.selected
        ? dispatch(coreActions.removeOrderFromCart(updatedOrder.mint))
        : dispatch(
            coreActions.addOrderToCart(
              marketPairs.find(
                (pair) => pair.pairPubkey === updatedOrder.targetPairPukey,
              ),
              updatedOrder,
              OrderType.BUY,
            ),
          );
    },
    [dispatch, marketPairs, market?.marketPubkey],
  );

  const {
    visible: exchangeModalVisible,
    open: openExchangeModal,
    close: closeExchangeModal,
  } = useExchangeModal();

  const onCancelExchangeModal = useCallback(() => {
    closeExchangeModal();
    dispatch(commonActions.setCartSider({ isVisible: false }));
    dispatch(coreActions.clearCart());
  }, [dispatch, closeExchangeModal]);

  const addBuyOrderToExchange = useCallback(
    (order: MarketOrder) => () => {
      const buyOrdersExists = !!cartItems?.buy.length;
      const sellOrdersExists = !!cartItems?.sell.length;

      if (buyOrdersExists || sellOrdersExists) {
        dispatch(coreActions.clearCart());
      }

      openExchangeModal();
      setSelectedBuyOrder({ ...order, royaltyPercent: market?.royaltyPercent });
    },
    [
      dispatch,
      cartItems?.buy.length,
      cartItems?.sell.length,
      openExchangeModal,
      market?.marketPubkey,
    ],
  );

  return (
    <div className={styles.tabContentWrapper}>
      {marketPairsLoading ? (
        <Spinner />
      ) : (
        <>
          <div className={styles.sortWrapper}>
            <SortOrdersControll
              control={control}
              setValue={setValue}
              optionsMobile={optionsMobile}
              options={options}
              sort={sort}
            />
          </div>

          <FakeInfinityScroll itemsPerScroll={21} className={styles.cards}>
            {sortedOrders.map((order) => (
              <NFTCard
                key={order.mint}
                imageUrl={order.imageUrl}
                name={order.name}
                price={formatBNToString(new BN(order.price))}
                royaltyPercent={market?.royaltyPercent}
                onCardClick={createOnBtnClick(order)}
                selected={order?.selected}
                onExchange={addBuyOrderToExchange(order)}
                rarity={order.rarity}
                isPnft={!!market?.isPnft}
              />
            ))}
          </FakeInfinityScroll>
        </>
      )}
      {!!selectedBuyOrder && (
        <ExchangeNftModal
          visible={exchangeModalVisible}
          onCancel={onCancelExchangeModal}
          selectedBuyOrder={selectedBuyOrder}
        />
      )}
    </div>
  );
};
