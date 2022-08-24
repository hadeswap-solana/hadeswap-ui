import { FC } from 'react';

import { CollectionPageLayout } from './CollectionPageLayout';
import styles from './Collection.module.scss';
import { NFTCard } from '../../components/NFTCard/NFTCard';

const cardMockData = {
  name: 'DeGod #3721',
  imageUrl: 'https://metadata.degods.com/g/3720-dead.png',
  price: '350.25',
};

export const CollectionBuy: FC = () => {
  return (
    <CollectionPageLayout>
      <div className={styles.cards}>
        {new Array(50).fill(null).map((_, idx) => (
          <NFTCard
            key={idx}
            imageUrl={cardMockData.imageUrl}
            name={cardMockData.name}
            price={cardMockData.price}
          />
        ))}
      </div>
    </CollectionPageLayout>
  );
};

export const CollectionSell: FC = () => {
  return (
    <CollectionPageLayout>
      <div className={styles.cards}>
        {new Array(2).fill(null).map((_, idx) => (
          <NFTCard
            key={idx}
            imageUrl={cardMockData.imageUrl}
            name={cardMockData.name}
            price={cardMockData.price}
          />
        ))}
      </div>
    </CollectionPageLayout>
  );
};
