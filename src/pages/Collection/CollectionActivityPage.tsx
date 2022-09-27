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
import InfinityScroll, {
  useFakeInfinityScroll,
} from '../../components/InfinityScroll';

export const CollectionActivityPage: FC = () => {
  const { publicKey: marketPublicKey } = useParams<{ publicKey: string }>();

  const loading = true;

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
          <p>bla bla bla</p>
          <p>bla bla bla</p>
        </InfinityScroll>
      )}
    </CollectionPageLayout>
  );
};

const ActivityCard = () => {};
