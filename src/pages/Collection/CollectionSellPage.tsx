import { FC, useCallback } from 'react';
import BN from 'bn.js';
import { CollectionPageLayout } from './CollectionPageLayout';
import { NFTCard } from '../../components/NFTCard/NFTCard';
import { useDispatch, useSelector } from 'react-redux';
import { useFetchMarketWalletNfts, useFetchMarketPairs } from '../../requests';
import {
  selectAllSellOrdersForMarket,
  selectMarketWalletNftsLoading,
  selectMarketPairs,
  selectMarketPairsLoading,
} from '../../state/core/selectors';
import { useWallet } from '@solana/wallet-adapter-react';
import { coreActions } from '../../state/core/actions';
import { useParams } from 'react-router-dom';
import { formatBNToString } from '../../utils';
import { MarketOrder, OrderType } from '../../state/core/types';
import { Spinner } from '../../components/Spinner/Spinner';
import { Typography } from 'antd';
import { FakeInfinityScroll } from '../../components/FakeInfiinityScroll';

import styles from './Collection.module.scss';

export const CollectionSellPage: FC = () => {
  const dispatch = useDispatch();
  const { connected } = useWallet();
  const { publicKey: marketPublicKey } = useParams<{ publicKey: string }>();

  useFetchMarketPairs();
  useFetchMarketWalletNfts(marketPublicKey);

  const pairsLoading = useSelector(selectMarketPairsLoading);
  const nftsLoading = useSelector(selectMarketWalletNftsLoading);

  const pairs = useSelector(selectMarketPairs);
  const orders = useSelector((state: never) =>
    selectAllSellOrdersForMarket(state, marketPublicKey),
  );

  const isLoading = nftsLoading || pairsLoading;

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

  return (
    <CollectionPageLayout>
      {!connected && (
        <Typography.Title level={3}>
          connect your wallet to see your nfts
        </Typography.Title>
      )}
      {connected && isLoading && <Spinner />}
      {!isLoading && connected && !orders.length && (
        <Typography.Title level={3}>no suitable nfts found</Typography.Title>
      )}
      {!isLoading && connected && !!orders.length && (
        <FakeInfinityScroll itemsPerScroll={21} className={styles.cards}>
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
        </FakeInfinityScroll>
      )}
    </CollectionPageLayout>
  );
};
