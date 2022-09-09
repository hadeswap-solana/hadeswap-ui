import { Button, Tabs, Layout } from 'antd';
import { FC, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { PairType } from 'hadeswap-sdk/lib/hadeswap-core/types';
import { AppLayout } from '../../components/Layout/AppLayout';
import {
  COLLECTION_TABS,
  createCollectionLink,
  createCreatePollLink,
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

  const onMakeOfferClick = () => {
    history.push(createCreatePollLink(marketPublicKey, PairType.TokenForNFT));
  };

  const onListClick = () => {
    history.push(createCreatePollLink(marketPublicKey, PairType.NftForToken));
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
            <Button type="primary" size="large" onClick={onMakeOfferClick}>
              Make offer
            </Button>
            <Button type="primary" size="large" onClick={onListClick}>
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
        </>
      )}

      <MakeOfferModal isVisible={isModalVisible} onCancel={handleCancel} />
    </AppLayout>
  );
};
