import { Button, Tabs, Layout } from 'antd';
import { FC, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { AppLayout } from '../../components/Layout/AppLayout';
import {
  COLLECTION_TABS,
  createCollectionLink,
  createCreatePoolPickSideLink,
} from '../../constants';
import { coreActions } from '../../state/core/actions';
import {
  selectCertainMarket,
  selectCertainMarketLoading,
} from '../../state/core/selectors';
import { CollectionGeneralInfo } from './CollectionGeneralInfo';
import { MakeOfferModal } from './MakeOfferModal';
import { Spinner } from '../../components/Spinner/Spinner';

import styles from './Collection.module.scss';

const { Content } = Layout;
const { TabPane } = Tabs;

export const CollectionPageLayout: FC = ({ children }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const history = useHistory();
  const { publicKey: marketPublicKey } = useParams<{ publicKey: string }>();
  const dispatch = useDispatch();

  const marketLoading = useSelector(selectCertainMarketLoading);
  const market = useSelector(selectCertainMarket);

  const activeTab = useMemo(
    () => history.location.pathname.split('/').at(-1) as COLLECTION_TABS,
    [history],
  );

  const onTabChangeHandler = (activeKey: string) => {
    history.push(
      createCollectionLink(activeKey as COLLECTION_TABS, marketPublicKey),
    );
  };

  const onCreatePoolClick = () => {
    history.push(createCreatePoolPickSideLink(marketPublicKey));
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (marketPublicKey && market?.marketPubkey !== marketPublicKey) {
      dispatch(coreActions.fetchMarketInfoAndPairs(marketPublicKey));
    }
  }, [dispatch, marketPublicKey, market]);

  return (
    <AppLayout>
      {marketLoading ? (
        <Spinner />
      ) : (
        <>
          <CollectionGeneralInfo
            collectionName={market?.collectionName}
            collectionImage={market?.collectionImage}
            floorPrice={market?.floorPrice}
            bestoffer={market?.bestoffer}
            offerTVL={market?.offerTVL}
          />
          <div className={styles.actionsContainer}>
            <Button type="primary" size="large" onClick={onCreatePoolClick}>
              + create pool
            </Button>
          </div>
          <Tabs
            defaultActiveKey={activeTab}
            centered
            onChange={onTabChangeHandler}
          >
            <TabPane tab="buy" key={COLLECTION_TABS.BUY} />
            <TabPane tab="sell" key={COLLECTION_TABS.SELL} />
            <TabPane tab="activity" key={COLLECTION_TABS.ACTIVITY} />
            <TabPane tab="pools" key={COLLECTION_TABS.POOLS} />
          </Tabs>
          <Content>{children}</Content>
        </>
      )}

      <MakeOfferModal isVisible={isModalVisible} onCancel={handleCancel} />
    </AppLayout>
  );
};
