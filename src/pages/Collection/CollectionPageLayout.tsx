import { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  useFetchMarket,
  useFetchMarketPairs,
  useFetchMarketWalletNfts,
} from '../../requests';
import { AppLayout } from '../../components/Layout/AppLayout';
import { Spinner } from '../../components/Spinner/Spinner';
import { CollectionTabs } from './components/CollectionTabs';
import { GeneralInfo } from './components/GeneralInfo';
import { selectCertainMarketLoading } from '../../state/core/selectors';
import { MakeOfferModal } from './MakeOfferModal';

export const CollectionPageLayout: FC = ({ children }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { publicKey: marketPublicKey } = useParams<{ publicKey: string }>();

  useFetchMarket(marketPublicKey);
  useFetchMarketPairs();
  useFetchMarketWalletNfts(marketPublicKey);

  const isLoading = useSelector(selectCertainMarketLoading);

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <AppLayout>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <GeneralInfo />
          <CollectionTabs />
          {children}
        </>
      )}
      <MakeOfferModal isVisible={isModalVisible} onCancel={handleCancel} />
    </AppLayout>
  );
};
