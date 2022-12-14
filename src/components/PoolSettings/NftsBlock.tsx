import { FC } from 'react';
import { NFTCard } from '../NFTCard/NFTCard';
import { NftWithSelect } from './hooks/usePoolServiceAssets';

import styles from './styles.module.scss';

interface NftsBlockProps {
  nfts: NftWithSelect[];
  toggleNft: (mint: string) => void;
}

export const NftsBlock: FC<NftsBlockProps> = ({ nfts, toggleNft }) => {
  return (
    <div className={styles.scrollBlockWrapper}>
      <div className={styles.nftsWrapper}>
        {nfts.map((nft) => (
          <NFTCard
            key={nft.mint}
            className={styles.nftCard}
            imageUrl={nft.imageUrl}
            name={nft.name}
            selected={nft.selected}
            rarity={nft.rarity}
            onCardClick={() => toggleNft(nft.mint)}
            wholeAreaSelect
            simpleCard
            createPool
          />
        ))}
      </div>
    </div>
  );
};
