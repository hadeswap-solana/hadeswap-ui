import { FC } from 'react';
import { Table } from 'antd';
import classNames from 'classnames';
import { ItemsListProps } from './index';

import styles from './styles.module.scss';
import { getTableWidth } from './helpers';

export const ItemsList: FC<ItemsListProps> = ({
  data,
  onRowClick,
  mapType,
  pubKey,
  tableClassName,
}) => {
  return (
    <Table
      style={{ maxWidth: getTableWidth() }}
      scroll={{ x: true, scrollToFirstRowOnChange: false }}
      className={classNames(styles.table, tableClassName)}
      columns={mapType}
      dataSource={data}
      pagination={false}
      rowKey={(record) => record[pubKey]}
      onRow={(source) => ({
        onClick: () => onRowClick(source[pubKey], source),
      })}
    />
  );
};
