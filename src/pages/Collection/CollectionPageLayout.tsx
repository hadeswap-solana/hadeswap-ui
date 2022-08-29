import { Button, Tabs, Layout } from 'antd';
import { FC, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

import { AppLayout } from '../../components/Layout/AppLayout';
import { COLLECTION_TABS, createCollectionLink } from '../../constants';
import { coreActions } from '../../state/core/actions';
import { selectCertainMarket } from '../../state/core/selectors';
import styles from './Collection.module.scss';
import { CollectionGeneralInfo } from './CollectionGeneralInfo';

const { Content } = Layout;
const { TabPane } = Tabs;

export const CollectionPageLayout: FC = ({ children }) => {
  const history = useHistory();
  const { publicKey: marketPublicKey } = useParams<{ publicKey: string }>();

  const activeTab = useMemo(
    () => history.location.pathname.split('/').at(-1) as COLLECTION_TABS,
    [history],
  );

  const onTabChangeHandler = (activeKey: string) => {
    history.push(
      createCollectionLink(activeKey as COLLECTION_TABS, marketPublicKey),
    );
  };

  const dispatch = useDispatch();

  useEffect(() => {
    marketPublicKey &&
      dispatch(coreActions.fetchMarketInfoAndPairs(marketPublicKey));
  }, [dispatch, marketPublicKey]);

  const market = useSelector(selectCertainMarket);

  return (
    <AppLayout>
      <CollectionGeneralInfo
        collectionName={market?.collectionName}
        collectionImage={market?.collectionImage}
        floorPrice={market?.floorPrice}
        bestoffer={market?.bestoffer}
        offerTVL={market?.offerTVL}
      />
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
