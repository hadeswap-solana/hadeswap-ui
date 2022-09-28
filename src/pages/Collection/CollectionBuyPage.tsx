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
import InfinityScroll, {
  useFakeInfinityScroll,
} from '../../components/InfinityScroll';

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

  const { itemsToShow, next } = useFakeInfinityScroll(21);

  return (
    <CollectionPageLayout>
      {loading ? (
        <Spinner />
      ) : (
        <InfinityScroll
          next={next}
          wrapperClassName={styles.cards}
          itemsToShow={itemsToShow}
        >
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
        </InfinityScroll>
      )}
    </CollectionPageLayout>
  );
};
