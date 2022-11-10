import { FC, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Tabs, Layout } from 'antd';
import { useFetchMarket } from '../../requests';
import { MarketInfo } from '../../state/core/types';
import { AppLayout } from '../../components/Layout/AppLayout';
import {
  COLLECTION_TABS,
  createCollectionLink,
  createCreatePoolPickSideLink,
} from '../../constants';
import { CollectionGeneralInfo } from './CollectionGeneralInfo';
import { MakeOfferModal } from './MakeOfferModal';
import { Spinner } from '../../components/Spinner/Spinner';

import styles from './Collection.module.scss';

const { Content } = Layout;
const { TabPane } = Tabs;

export const CollectionPageLayout: FC = ({ children }) => {
  const history = useHistory();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { publicKey: marketPublicKey } = useParams<{ publicKey: string }>();

  const {
    data: market,
    isLoading,
    isFetching,
  }: {
    data: MarketInfo;
    isLoading: boolean;
    isFetching: boolean;
  } = useFetchMarket(marketPublicKey);

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
      {isLoading || isFetching ? (
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
