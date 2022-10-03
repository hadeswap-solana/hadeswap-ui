import { FC, useCallback } from 'react';
import BN from 'bn.js';
import { CollectionPageLayout } from './CollectionPageLayout';
import styles from './Collection.module.scss';
import { NFTCard } from '../../components/NFTCard/NFTCard';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAllBuyOrdersForMarket,
  selectMarketPairs,
  selectMarketPairsLoading,
} from '../../state/core/selectors';
import { coreActions } from '../../state/core/actions';
import { formatBNToString } from '../../utils';
import { MarketOrder, OrderType } from '../../state/core/types';
import { Spinner } from '../../components/Spinner/Spinner';
import { FakeInfinityScroll } from '../../components/FakeInfiinityScroll';

export const CollectionBuyPage: FC = () => {
  const orders = useSelector(selectAllBuyOrdersForMarket);
  const loading = useSelector(selectMarketPairsLoading);
  const pairs = useSelector(selectMarketPairs);
  const dispatch = useDispatch();

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
      {loading ? (
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
