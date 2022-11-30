import { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  useFetchMarket,
  useFetchMarketPairs,
  useFetchMarketWalletNfts,
} from '../../requests';
import { AppLayout } from '../../components/Layout/AppLayout';
import { CollectionTabs } from './components/CollectionTabs';
import { CollectionHeader } from './components/CollectionHeader';
import { MakeOfferModal } from './components/MakeOfferModal';

export const CollectionPage: FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { publicKey: marketPublicKey } = useParams<{ publicKey: string }>();

  useFetchMarket(marketPublicKey);
  useFetchMarketPairs();
  useFetchMarketWalletNfts(marketPublicKey);

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <AppLayout>
      <CollectionHeader />
      <CollectionTabs />
      <MakeOfferModal isVisible={isModalVisible} onCancel={handleCancel} />
    </AppLayout>
  );
};
