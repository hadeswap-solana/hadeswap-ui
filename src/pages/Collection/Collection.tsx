import { FC, useCallback, useEffect } from 'react';
import BN from 'bn.js';
import { CollectionPageLayout } from './CollectionPageLayout';
import styles from './Collection.module.scss';
import { NFTCard } from '../../components/NFTCard/NFTCard';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAllBuyOrdersForMarket,
  selectAllSellOrdersForMarket,
} from '../../state/core/selectors';
import { useWallet } from '@solana/wallet-adapter-react';
import { coreActions } from '../../state/core/actions';
import { useParams } from 'react-router-dom';
import { formatBNToString } from '../../utils';
import { BuyOrder, SellOrder } from '../../state/core/actions/cartActions';

export const CollectionBuy: FC = () => {
  const orders = useSelector(selectAllSellOrdersForMarket);
  const dispatch = useDispatch();

  const createOnBtnClick = useCallback(
    (order: SellOrder) => () => {
      order?.selected
        ? dispatch(coreActions.removeBuyItem(order.pair, order.mint))
        : dispatch(coreActions.addBuyItem(order));
    },
    [dispatch],
  );

  return (
    <CollectionPageLayout>
      <div className={styles.cards}>
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
      </div>
    </CollectionPageLayout>
  );
};

export const CollectionSell: FC = () => {
  const { publicKey: marketPublicKey } = useParams<{ publicKey: string }>();

  const { connected } = useWallet();
  const dispatch = useDispatch();

  useEffect(() => {
    connected && marketPublicKey && dispatch(coreActions.fetchWalletNfts());
  }, [dispatch, connected, marketPublicKey]);

  const orders = useSelector((state: never) =>
    selectAllBuyOrdersForMarket(state, marketPublicKey),
  );

  const createOnBtnClick = useCallback(
    (order: BuyOrder) => () => {
      order?.selected
        ? dispatch(coreActions.removeSellItem(order.pair, order.mint))
        : dispatch(coreActions.addSellItem(order));
    },
    [dispatch],
  );

  return (
    <CollectionPageLayout>
      <div className={styles.cards}>
        {orders.map((order) => (
          <NFTCard
            key={order.mint}
            imageUrl={order.imageUrl}
            name={order.name}
            price={formatBNToString(new BN(order.price))}
            onBtnClick={createOnBtnClick(order)}
            selected={order?.selected}
          />
        ))}
      </div>
    </CollectionPageLayout>
  );
};
