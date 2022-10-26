import { FC } from 'react';
import { Table } from 'antd';
import { TableProps } from '../../pages/Collections/components/CollectionsList';
import styles from './CollectionList.module.scss';

export const CollectionList: FC<TableProps> = ({ columns, data, itemKey, onRowClick }) => (
  <Table
    className={styles.table}
    columns={columns}
    dataSource={data}
    pagination={false}
    rowKey={(record) => record[itemKey]}
    onRow={(source) => ({ onClick: () => onRowClick(source[itemKey]) })}
  />
);
