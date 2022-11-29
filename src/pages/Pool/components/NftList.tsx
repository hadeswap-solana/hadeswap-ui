import { FC } from 'react';
import { FakeInfinityScroll } from '../../../components/FakeInfiinityScroll';
import { NFTCard } from '../../../components/NFTCard/NFTCard';
import { Pair } from '../../../state/core/types';

import styles from './styles.module.scss';

interface NftListProps {
  pool: Pair;
}

export const NftList: FC<NftListProps> = ({ pool }) => (
  <div className={styles.nftsListWrapper}>
    <h2 className={styles.nftsListTitle}>NFTs</h2>
    <FakeInfinityScroll itemsPerScroll={21} className={styles.nftsList}>
      {pool?.sellOrders?.map((order) => (
        <NFTCard
          className={styles.nftCart}
          key={order.mint}
          imageUrl={order.imageUrl}
          name={order.name}
          simpleCard
        />
      ))}
    </FakeInfinityScroll>
  </div>
);
