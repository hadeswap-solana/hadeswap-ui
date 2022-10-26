import { FC } from 'react';
import { Table } from 'antd';
import { TableProps } from './index'
import {COLUMNS_DESKTOP} from "../../Collections.constants";
import styles from './CollectionList.module.scss';

export const CollectionList: FC<TableProps> = ({ data, onRowClick }) => (
  <Table
    className={styles.table}
    columns={COLUMNS_DESKTOP}
    dataSource={data}
    pagination={false}
    rowKey={(record) => record.marketPubkey}
    onRow={(source) => ({ onClick: () => onRowClick(source.marketPubkey) })}
  />
);
