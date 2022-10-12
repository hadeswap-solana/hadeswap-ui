import { FC, memo } from 'react';
import { Table } from "antd";
import styles from "../Collections.module.scss";
import { COLUMNS } from "../Collections.constants";
import { MarketInfo } from "../../../state/core/types";

interface CollectionsListProps {
  data: MarketInfo[];
  onRowClick: (marketPubkey: string) => void;
}

export const CollectionsList: FC<CollectionsListProps> = memo(({ data, onRowClick }) => (
  <Table
    className={styles.table}
    columns={COLUMNS}
    dataSource={data}
    pagination={false}
    rowKey={(record) => record.marketPubkey}
    onRow={({ marketPubkey }) => ({ onClick: () => onRowClick(marketPubkey) })}
  />
));
