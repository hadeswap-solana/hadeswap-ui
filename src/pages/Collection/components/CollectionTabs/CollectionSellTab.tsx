import { FC, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import BN from 'bn.js';
import { Typography } from 'antd';
import { NFTCard } from '../../../../components/NFTCard/NFTCard';
import { Spinner } from '../../../../components/Spinner/Spinner';
import { FakeInfinityScroll } from '../../../../components/FakeInfiinityScroll';
import { formatBNToString } from '../../../../utils';
import {
  selectAllSellOrdersForMarket,
  selectMarketWalletNftsLoading,
  selectMarketPairs,
  selectMarketPairsLoading,
  selectCertainMarket,
} from '../../../../state/core/selectors';
import { coreActions } from '../../../../state/core/actions';
import { MarketOrder, OrderType } from '../../../../state/core/types';

import styles from './styles.module.scss';

export const CollectionSellTab: FC = () => {
  const dispatch = useDispatch();
  const { connected } = useWallet();
  const { publicKey: marketPublicKey } = useParams<{ publicKey: string }>();

  const marketPairsLoading = useSelector(selectMarketPairsLoading);
  const nftsLoading = useSelector(selectMarketWalletNftsLoading);

  const marketPairs = useSelector(selectMarketPairs);
  const sellOrders = useSelector((state: never) =>
    selectAllSellOrdersForMarket(state, marketPublicKey),
  );

  const market = useSelector(selectCertainMarket);

  const isLoading = nftsLoading || marketPairsLoading;

  const createOnBtnClick = useCallback(
    (order: MarketOrder) => () => {
      const updatedOrder = {
        ...order,
        isPnft: market?.isPnft,
        royaltyPercent: market?.royaltyPercent,
        market: market.marketPubkey,
      };

      order?.selected
        ? dispatch(coreActions.removeOrderFromCart(order.mint))
        : dispatch(
            coreActions.addOrderToCart(
              marketPairs.find(
                (pair) => pair.pairPubkey === order.targetPairPukey,
              ),
              updatedOrder,
              OrderType.SELL,
            ),
          );
    },
    [dispatch, marketPairs],
  );

  return (
    <div className={styles.tabContentWrapper}>
      {!connected && (
        <Typography.Title level={3}>
          connect your wallet to see your nfts
        </Typography.Title>
      )}
      {connected && isLoading && <Spinner />}
      {!isLoading && connected && !sellOrders.length && (
        <Typography.Title level={3}>no suitable nfts found</Typography.Title>
      )}
      {!isLoading && connected && !!sellOrders.length && (
        <FakeInfinityScroll itemsPerScroll={21} className={styles.cards}>
          {sellOrders.map((order) => (
            <NFTCard
              key={order.mint}
              imageUrl={order.imageUrl}
              name={order.name}
              price={
                order.price > 0 ? formatBNToString(new BN(order.price)) : ''
              }
              royaltyPercent={market?.royaltyPercent}
              onCardClick={createOnBtnClick(order)}
              selected={order?.selected}
              disabled={order.price <= 0}
              rarity={order.rarity}
              isPnft={!!market?.isPnft}
            />
          ))}
        </FakeInfinityScroll>
      )}
    </div>
  );
};
