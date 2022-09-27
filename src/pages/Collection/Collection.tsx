import { FC, useCallback, useEffect } from 'react';
import BN from 'bn.js';
import { CollectionPageLayout } from './CollectionPageLayout';
import styles from './Collection.module.scss';
import { NFTCard } from '../../components/NFTCard/NFTCard';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAllBuyOrdersForMarket,
  selectAllSellOrdersForMarket,
  selectMarketPairs,
  selectMarketPairsLoading,
  selectMarketWalletNftsLoading,
} from '../../state/core/selectors';
import { useWallet } from '@solana/wallet-adapter-react';
import { coreActions } from '../../state/core/actions';
import { useParams } from 'react-router-dom';
import { formatBNToString } from '../../utils';
import { MarketOrder, OrderType } from '../../state/core/types';
import { Spinner } from '../../components/Spinner/Spinner';
import { Typography } from 'antd';
import InfinityScroll, {
  useFakeInfinityScroll,
} from '../../components/InfinityScroll';

export const CollectionBuy: FC = () => {
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

export const CollectionSell: FC = () => {
  const { publicKey: marketPublicKey } = useParams<{ publicKey: string }>();

  const { connected } = useWallet();
  const dispatch = useDispatch();

  useEffect(() => {
    connected &&
      marketPublicKey &&
      dispatch(coreActions.fetchMarketWalletNfts(marketPublicKey));
  }, [dispatch, connected, marketPublicKey]);

  const orders = useSelector((state: never) =>
    selectAllSellOrdersForMarket(state, marketPublicKey),
  );
  const pairs = useSelector(selectMarketPairs);

  const marketPairsLoading = useSelector(selectMarketPairsLoading);
  const walletNftsLoading = useSelector(selectMarketWalletNftsLoading);

  const loading = marketPairsLoading || walletNftsLoading;

  const createOnBtnClick = useCallback(
    (order: MarketOrder) => () => {
      order?.selected
        ? dispatch(coreActions.removeOrderFromCart(order.mint))
        : dispatch(
            coreActions.addOrderToCart(
              pairs.find((pair) => pair.pairPubkey === order.targetPairPukey),
              order,
              OrderType.SELL,
            ),
          );
    },
    [dispatch, pairs],
  );

  const { itemsToShow, next } = useFakeInfinityScroll(21);

  return (
    <CollectionPageLayout>
      {!connected && (
        <Typography.Title level={3}>
          connect your wallet to see your nfts
        </Typography.Title>
      )}
      {connected && loading && <Spinner />}
      {!loading && connected && !orders.length && (
        <Typography.Title level={3}>no suitable nfts found</Typography.Title>
      )}
      {!loading && connected && !!orders.length && (
        <InfinityScroll
          next={next}
          wrapperClassName={styles.cards}
          itemsToShow={itemsToShow}
        >
          {orders.map((order) => (
            <NFTCard
              key={order.mint}
              imageUrl={order.imageUrl}
              name={order.name}
              price={
                order.price > 0 ? formatBNToString(new BN(order.price)) : ''
              }
              onBtnClick={createOnBtnClick(order)}
              selected={order?.selected}
              disabled={order.price <= 0}
            />
          ))}
        </InfinityScroll>
      )}
    </CollectionPageLayout>
  );
};
