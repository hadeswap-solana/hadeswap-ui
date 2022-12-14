import { FC } from 'react';
import { Tabs } from 'antd';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { TabButton } from './TabButton';
import { CollectionBuyTab } from './CollectionBuyTab';
import { CollectionSellTab } from './CollectionSellTab';
import { CollectionActivityTab } from './CollectionActivityTab';
import { CollectionPoolsTab } from './CollectionPoolsTab';
import {
  selectAllBuyOrdersForMarket,
  selectAllSellOrdersForMarket,
  selectPoolsTableInfo,
} from '../../../../state/core/selectors';

import styles from './styles.module.scss';

const { TabPane } = Tabs;

export const CollectionTabs: FC = () => {
  const { publicKey: marketPublicKey } = useParams<{ publicKey: string }>();

  const poolsTableInfo = useSelector(selectPoolsTableInfo);
  const buyOrders = useSelector(selectAllBuyOrdersForMarket);
  const sellOrders = useSelector((state: never) =>
    selectAllSellOrdersForMarket(state, marketPublicKey),
  );

  return (
    <div className={styles.collectionTabsWrapper}>
      <Tabs defaultActiveKey="buy" centered>
        <TabPane
          key="buy"
          tab={<TabButton title="buy" data={buyOrders.length} />}
        >
          <CollectionBuyTab />
        </TabPane>
        <TabPane
          key="sell"
          tab={<TabButton title="sell" data={sellOrders.length} />}
        >
          <CollectionSellTab />
        </TabPane>
        <TabPane key="activity" tab="activity">
          <CollectionActivityTab />
        </TabPane>
        <TabPane
          key="pools"
          tab={<TabButton title="pools" data={poolsTableInfo.length} />}
        >
          <CollectionPoolsTab />
        </TabPane>
      </Tabs>
    </div>
  );
};
