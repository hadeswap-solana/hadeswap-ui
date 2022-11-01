import { FC } from 'react';
import { CollectionTableProps } from '../index';
import CollectionItem from '../../ColletionItem/mobile';
import { COLLECTION } from '../../../constants/common';

export const CollectionList: FC<CollectionTableProps> = ({
  onRowClick,
  data,
}) => (
  <>
    {data.map((item) => (
      <CollectionItem
        key={item.marketPubkey}
        item={item}
        onRowClick={onRowClick}
        listingType={COLLECTION}
      />
    ))}
  </>
);
