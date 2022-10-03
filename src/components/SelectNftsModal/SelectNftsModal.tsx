import { useWallet } from '@solana/wallet-adapter-react';
import { CloseOutlined } from '@ant-design/icons';
import { Modal, Typography } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { coreActions } from '../../state/core/actions';
import {
  selectMarketWalletNfts,
  selectMarketWalletNftsLoading,
} from '../../state/core/selectors';
import { Nft, PairSellOrder } from '../../state/core/types';
import { NFTCard } from '../NFTCard/NFTCard';
import styles from './SelectNftsModal.module.scss';
import { Spinner } from '../Spinner/Spinner';
import { FakeInfinityScroll } from '../FakeInfiinityScroll';

type UseSelectNftsModal = (
  collectionName: string,
  marketPublicKey: string,
  preSelectedNfts?: PairSellOrder[],
) => {
  visible: boolean;
  setVisible: (nextState: boolean) => void;
  collectionName: string;
  selectedNfts: Nft[];
  walletNfts: Nft[];
  toggleNft: (nft: Nft) => void;
  isNftSelected: (nft: Nft) => boolean;
  loading: boolean;
};

const { Title } = Typography;

export const useSelectNftsModal: UseSelectNftsModal = (
  collectionName,
  marketPublicKey,
  preSelectedNfts,
) => {
  const dispatch = useDispatch();
  const { connected } = useWallet();

  const [visible, setVisible] = useState(false);
  const [selectedNfts, setSelectedNfts] = useState<Nft[]>([]);
  const walletNfts = useSelector(selectMarketWalletNfts);
  const loading = useSelector(selectMarketWalletNftsLoading);

  useEffect(() => {
    if (connected && marketPublicKey) {
      dispatch(coreActions.fetchMarketWalletNfts(marketPublicKey));
    }
  }, [dispatch, connected, marketPublicKey]);

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
    collectionName,
    selectedNfts,
    walletNfts,
    toggleNft,
    isNftSelected,
    loading,
  };
};

export const SelectNftsModal: FC<ReturnType<UseSelectNftsModal>> = ({
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
              onBtnClick={() => toggleNft(nft)}
              selected={isNftSelected(nft)}
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
