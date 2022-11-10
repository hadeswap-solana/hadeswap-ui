import { FC, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, Tabs, Layout } from 'antd';
import { useFetchMarket } from '../../requests';
import { AppLayout } from '../../components/Layout/AppLayout';
import { Spinner } from '../../components/Spinner/Spinner';
import {
  COLLECTION_TABS,
  createCollectionLink,
  createCreatePoolPickSideLink,
} from '../../constants';
import {
  selectCertainMarket,
  selectCertainMarketLoading,
} from '../../state/core/selectors';
import { CollectionGeneralInfo } from './CollectionGeneralInfo';
import { MakeOfferModal } from './MakeOfferModal';

import styles from './Collection.module.scss';

const { TabPane } = Tabs;

export const CollectionPageLayout: FC = ({ children }) => {
  const history = useHistory();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { publicKey: marketPublicKey } = useParams<{ publicKey: string }>();

  useFetchMarket(marketPublicKey);

  const market = useSelector(selectCertainMarket);
  const isLoading = useSelector(selectCertainMarketLoading);

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

  return (
    <AppLayout>
      {isLoading ? (
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
          {children}
        </>
      )}

      <MakeOfferModal isVisible={isModalVisible} onCancel={handleCancel} />
    </AppLayout>
  );
};
