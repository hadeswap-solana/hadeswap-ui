import { FC } from 'react';
import { Table } from 'antd';
import { POOL_TABLE_COLUMNS } from '../../utils/table/constants';
import { PoolsTableProps } from './index';

export const PoolsList: FC<PoolsTableProps> = ({ data, onRowClick }) => (
  <Table
    style={{ cursor: 'pointer' }}
    columns={POOL_TABLE_COLUMNS}
    dataSource={data}
    pagination={false}
    rowKey={(record) => record.pairPubkey}
    onRow={(source) => ({ onClick: () => onRowClick(source.pairPubkey) })}
  />
);
