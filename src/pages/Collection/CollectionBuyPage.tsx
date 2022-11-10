import { FC, useCallback } from 'react';
import BN from 'bn.js';
import { useDispatch, useSelector } from 'react-redux';
import { useDispatchMarketPairs } from '../../requests/hooks';
import { CollectionPageLayout } from './CollectionPageLayout';
import { NFTCard } from '../../components/NFTCard/NFTCard';
import { Spinner } from '../../components/Spinner/Spinner';
import { FakeInfinityScroll } from '../../components/FakeInfiinityScroll';
import {
  selectAllBuyOrdersForMarket,
  selectMarketPairs,
} from '../../state/core/selectors';
import { coreActions } from '../../state/core/actions';
import { formatBNToString } from '../../utils';
import { MarketOrder, OrderType, Pair } from '../../state/core/types';

import styles from './Collection.module.scss';

export const CollectionBuyPage: FC = () => {
  const dispatch = useDispatch();

  const pairsLoading: boolean = useDispatchMarketPairs();

  const pairs: Pair[] = useSelector(selectMarketPairs);
  const orders: MarketOrder[] = useSelector(selectAllBuyOrdersForMarket);

  const createOnBtnClick = useCallback(
    (order: MarketOrder) => () => {
      order?.selected
        ? dispatch(coreActions.removeOrderFromCart(order.mint))
        : dispatch(
            coreActions.addOrderToCart(
              pairs.find((pair) => pair.pairPubkey === order.targetPairPukey),
              order,
              OrderType.BUY,
            ),
          );
    },
    [dispatch, pairs],
  );

  return (
    <CollectionPageLayout>
      {pairsLoading ? (
        <Spinner />
      ) : (
        <FakeInfinityScroll itemsPerScroll={21} className={styles.cards}>
          {orders.map((order) => {
            return (
              <NFTCard
                key={order.mint}
                imageUrl={order.imageUrl}
                name={order.name}
                price={formatBNToString(new BN(order.price))}
                onBtnClick={createOnBtnClick(order)}
                selected={order?.selected}
              />
            );
          })}
        </FakeInfinityScroll>
      )}
    </CollectionPageLayout>
  );
};
