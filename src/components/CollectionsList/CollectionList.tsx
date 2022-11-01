import { FC } from 'react';
import { Table } from 'antd';
import { CollectionTableProps } from './index';
import { COLLECTION_COLUMNS } from '../../utils/table/constants';
import styles from './CollectionList.module.scss';

export const CollectionList: FC<CollectionTableProps> = ({
  data,
  onRowClick,
}) => (
  <Table
    className={styles.table}
    columns={COLLECTION_COLUMNS}
    dataSource={data}
    pagination={false}
    rowKey={(record) => record.marketPubkey}
    onRow={(source) => ({ onClick: () => onRowClick(source.marketPubkey) })}
  />
);
