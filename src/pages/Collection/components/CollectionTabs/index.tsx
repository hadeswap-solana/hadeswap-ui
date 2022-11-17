import { FC, useMemo, useCallback } from 'react';
import { Tabs } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  COLLECTION_TABS,
  createCollectionLink,
  createCreatePoolPickSideLink,
} from '../../../../constants';
import Button from '../../../../components/Buttons/Button';
import { TabButton } from './TabButton';
import {
  selectAllBuyOrdersForMarket,
  selectAllSellOrdersForMarket,
  selectPoolsTableInfo,
} from '../../../../state/core/selectors';

import styles from './styles.module.scss';

const { TabPane } = Tabs;

export const CollectionTabs: FC = () => {
  const history = useHistory();
  const { publicKey: marketPublicKey } = useParams<{ publicKey: string }>();

  const poolsTableInfo = useSelector(selectPoolsTableInfo);
  const buyOrders = useSelector(selectAllBuyOrdersForMarket);
  const sellOrders = useSelector((state: never) =>
    selectAllSellOrdersForMarket(state, marketPublicKey),
  );

  const activeTab = useMemo(
    () => history.location.pathname.split('/').at(-1) as COLLECTION_TABS,
    [history],
  );

  const onTabChangeHandler = useCallback(
    (activeKey: string) => {
      if (activeKey !== 'null') {
        history.push(
          createCollectionLink(activeKey as COLLECTION_TABS, marketPublicKey),
        );
      }
    },
    [history, marketPublicKey],
  );

  const onCreatePoolClick = useCallback(() => {
    history.push(createCreatePoolPickSideLink(marketPublicKey));
  }, [history, marketPublicKey]);

  return (
    <div className={styles.collectionTabsWrapper}>
      <Tabs defaultActiveKey={activeTab} centered onChange={onTabChangeHandler}>
        <TabPane
          tab={<TabButton title="buy" data={buyOrders.length} />}
          key={COLLECTION_TABS.BUY}
        />
        <TabPane
          tab={<TabButton title="sell" data={sellOrders.length} />}
          key={COLLECTION_TABS.SELL}
        />
        <TabPane tab="activity" key={COLLECTION_TABS.ACTIVITY} />
        <TabPane
          tab={<TabButton title="pools" data={poolsTableInfo.length} />}
          key={COLLECTION_TABS.POOLS}
        />
        <TabPane
          key={'null'}
          tab={
            <Button className={styles.poolButton} onClick={onCreatePoolClick}>
              <span>create pool</span>
            </Button>
          }
        />
      </Tabs>
    </div>
  );
};
