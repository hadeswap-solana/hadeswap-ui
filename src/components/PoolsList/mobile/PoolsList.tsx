import { FC } from 'react';
import CollectionItem from '../../ColletionItem/mobile';
import { PoolsTableProps } from '../index';

export const PoolsList: FC<PoolsTableProps> = ({ onRowClick, data }) => (
  <>
    {data.map((item) => (
      <CollectionItem
        key={item.pairPubkey}
        item={item}
        onRowClick={onRowClick}
      />
    ))}
  </>
);
