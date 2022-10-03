import { FC, useCallback, useEffect } from 'react';
import BN from 'bn.js';
import { CollectionPageLayout } from './CollectionPageLayout';
import styles from './Collection.module.scss';
import { NFTCard } from '../../components/NFTCard/NFTCard';
import { useDispatch, useSelector } from 'react-redux';
import {
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
import { FakeInfinityScroll } from '../../components/FakeInfiinityScroll';

export const CollectionSellPage: FC = () => {
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
