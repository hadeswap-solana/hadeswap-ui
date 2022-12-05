import { FC } from 'react';
import { Table } from 'antd';
import classNames from 'classnames';
import { ItemsListProps } from './index';

import styles from './styles.module.scss';

export const ItemsList: FC<ItemsListProps> = ({
  idKey,
  pubKey,
  data,
  mapType,
  onRowClick,
  tableClassName,
}) => (
  <Table
    className={classNames(styles.table, tableClassName)}
    columns={mapType}
    dataSource={data}
    pagination={false}
    rowKey={(record) => record[idKey || pubKey]}
    onRow={(source) => ({
      onClick: () => onRowClick(source[pubKey], source),
    })}
  />
);
