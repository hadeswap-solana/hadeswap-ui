import { Button, Tabs, Layout } from 'antd';
import { FC, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { AppLayout } from '../../components/Layout/AppLayout';
import { COLLECTION_TABS, createCollectionLink } from '../../constants';
import styles from './Collection.module.scss';
import { CollectionGeneralInfo } from './CollectionGeneralInfo';
import { mockData } from './mockData';

const { Content } = Layout;
const { TabPane } = Tabs;

export const CollectionPageLayout: FC = ({ children }) => {
  const { slug } = mockData;
  const history = useHistory();

  const activeTab = useMemo(
    () => history.location.pathname.split('/').at(-1) as COLLECTION_TABS,
    [history],
  );

  const onTabChangeHandler = (activeKey: string) => {
    history.push(createCollectionLink(activeKey as COLLECTION_TABS, slug));
  };

  return (
    <AppLayout>
      <CollectionGeneralInfo />
      <div className={styles.actionsContainer}>
        <Button type="primary" size="large">
          Make offer
        </Button>
        <Button type="primary" size="large">
          List
        </Button>
      </div>
      <Tabs
        defaultActiveKey={activeTab}
        centered
        type="card"
        onChange={onTabChangeHandler}
      >
        <TabPane tab="Buy" key={COLLECTION_TABS.BUY} />
        <TabPane tab="Sell" key={COLLECTION_TABS.SELL} />
        <TabPane tab="Activity" key="3" disabled />
        <TabPane tab="Pools" key={COLLECTION_TABS.POOLS} />
      </Tabs>
      <Content>{children}</Content>
    </AppLayout>
  );
};
