import { FC } from 'react';
import { Table } from 'antd';
import { CollectionPageLayout } from './CollectionPageLayout';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  selectMarketPairsLoading,
  selectPoolsTableInfo,
} from '../../state/core/selectors';
import { Spinner } from '../../components/Spinner/Spinner';
import { POOL_TABLE_COLUMNS } from '../../utils/table/constants';

export const CollectionPoolsPage: FC = () => {
  const history = useHistory();

  const poolsTableInfo = useSelector(selectPoolsTableInfo);
  const loading = useSelector(selectMarketPairsLoading);

  return (
    <CollectionPageLayout>
      {loading ? (
        <Spinner />
      ) : (
        <Table
          columns={POOL_TABLE_COLUMNS}
          dataSource={poolsTableInfo}
          pagination={false}
          style={{ cursor: 'pointer' }}
          rowKey={(record) => record.pairPubkey}
          onRow={({ pairPubkey }) => {
            return {
              onClick: () => {
                history.push(`/pools/${pairPubkey}`);
                window.scrollTo(0, 0);
              },
            };
          }}
        />
      )}
    </CollectionPageLayout>
  );
};
