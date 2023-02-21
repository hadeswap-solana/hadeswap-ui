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
}) => {
  return (
    <Table
      className={classNames(styles.table, tableClassName)}
      columns={mapType}
      dataSource={data}
      pagination={false}
      rowKey={(record, ...rest) => {
        return record[idKey] || rest[0];
      }}
      onRow={(source) => ({
        onClick: () => onRowClick(source[pubKey], source),
      })}
    />
  );
};
