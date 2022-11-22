import { FC, useCallback } from 'react';
import BN from 'bn.js';
import { useDispatch, useSelector } from 'react-redux';
import { SweepButton } from '../SweepButton';
import { NFTCard } from '../../../../components/NFTCard/NFTCard';
import { Spinner } from '../../../../components/Spinner/Spinner';
import { FakeInfinityScroll } from '../../../../components/FakeInfiinityScroll';
import {
  selectAllBuyOrdersForMarket,
  selectMarketPairs,
  selectMarketPairsLoading,
} from '../../../../state/core/selectors';
import { coreActions } from '../../../../state/core/actions';
import { formatBNToString } from '../../../../utils';
import { MarketOrder, OrderType } from '../../../../state/core/types';

import styles from './styles.module.scss';

export const CollectionBuyTab: FC = () => {
  const dispatch = useDispatch();

  const marketPairsLoading = useSelector(selectMarketPairsLoading);
  const marketPairs = useSelector(selectMarketPairs);
  const buyOrders = useSelector(selectAllBuyOrdersForMarket);

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

  return (
    <div className={styles.tabContentWrapper}>
      {marketPairsLoading ? (
        <Spinner />
      ) : (
        <>
          <SweepButton />
          <FakeInfinityScroll itemsPerScroll={21} className={styles.cards}>
            {buyOrders.map((order) => (
              <NFTCard
                key={order.mint}
                imageUrl={order.imageUrl}
                name={order.name}
                price={formatBNToString(new BN(order.price))}
                onAddToCart={createOnBtnClick(order)}
                selected={order?.selected}
              />
            ))}
          </FakeInfinityScroll>
        </>
      )}
    </div>
  );
};
