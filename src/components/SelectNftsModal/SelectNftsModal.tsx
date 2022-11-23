import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Typography } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useFetchMarketWalletNfts } from '../../requests';
import { Nft, PairSellOrder } from '../../state/core/types';
import {
  selectMarketWalletNfts,
  selectMarketWalletNftsLoading,
} from '../../state/core/selectors';
import { NFTCard } from '../NFTCard/NFTCard';
import { Spinner } from '../Spinner/Spinner';
import { FakeInfinityScroll } from '../FakeInfiinityScroll';

import styles from './SelectNftsModal.module.scss';

export interface NftsModal {
  visible: boolean;
  setVisible: (nextState: boolean) => void;
  selectedNfts: Nft[];
  walletNfts: Nft[];
  toggleNft: (nft: Nft) => void;
  isNftSelected: (nft: Nft) => boolean;
  loading: boolean;
}

type UseSelectNftsModal = (
  marketPublicKey: string,
  preSelectedNfts?: PairSellOrder[],
) => NftsModal;

const { Title } = Typography;

export const useSelectNftsModal: UseSelectNftsModal = (
  marketPublicKey,
  preSelectedNfts,
) => {
  const [visible, setVisible] = useState(false);
  const [selectedNfts, setSelectedNfts] = useState<Nft[]>([]);

  useFetchMarketWalletNfts(marketPublicKey);

  const walletNfts = useSelector(selectMarketWalletNfts);
  const isLoading = useSelector(selectMarketWalletNftsLoading);

  useEffect(() => {
    if (preSelectedNfts) {
      setSelectedNfts(preSelectedNfts);
    }
  }, [preSelectedNfts]);

  const isNftSelected = (nft: Nft) =>
    !!selectedNfts.find(({ mint }) => mint === nft.mint);

  const toggleNft = (nft: Nft) => {
    const selected = isNftSelected(nft);
    if (selected) {
      setSelectedNfts((prev) => prev.filter(({ mint }) => mint !== nft.mint));
    } else {
      setSelectedNfts((prev) => [...prev, nft]);
    }
  };

  return {
    visible,
    setVisible,
    selectedNfts,
    walletNfts,
    toggleNft,
    isNftSelected,
    loading: isLoading,
  };
};

interface SelectNftsModalProps extends NftsModal {
  collectionName: string;
}

export const SelectNftsModal: FC<SelectNftsModalProps> = ({
  visible,
  setVisible,
  collectionName = '',
  walletNfts,
  toggleNft,
  isNftSelected,
  loading,
}) => {
  return (
    <Modal
      visible={visible}
      footer={null}
      centered
      closable
      closeIcon={<CloseOutlined />}
      onCancel={() => setVisible(false)}
      width={860}
      destroyOnClose
    >
      {collectionName && <Title level={3}>{collectionName}</Title>}
      {loading && <Spinner />}
      {!!walletNfts?.length && !loading && (
        <FakeInfinityScroll itemsPerScroll={12} className={styles.content}>
          {walletNfts?.map((nft) => (
            <NFTCard
              disabled={nft.disabled}
              key={nft.mint}
              imageUrl={nft.imageUrl}
              name={nft.name}
              onCardClick={() => toggleNft(nft)}
              selected={isNftSelected(nft)}
              simpleCard
            />
          ))}
        </FakeInfinityScroll>
      )}
      {!walletNfts?.length && !loading && (
        <Title level={5}>no nfts of this collections</Title>
      )}
    </Modal>
  );
};
