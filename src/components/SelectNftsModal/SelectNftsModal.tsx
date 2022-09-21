import { useWallet } from '@solana/wallet-adapter-react';
import { CloseOutlined } from '@ant-design/icons';
import { Modal, Typography } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { coreActions } from '../../state/core/actions';
import { selectMarketWalletNfts } from '../../state/core/selectors';
import { Nft, PairSellOrder } from '../../state/core/types';
import { NFTCard } from '../NFTCard/NFTCard';
import styles from './SelectNftsModal.module.scss';

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
};

const { Title, Paragraph } = Typography;

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
  };
};

export const SelectNftsModal: FC<ReturnType<UseSelectNftsModal>> = ({
  visible,
  setVisible,
  collectionName = '',
  walletNfts,
  toggleNft,
  isNftSelected,
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
    >
      {collectionName && <Title level={3}>{collectionName}</Title>}
      {walletNfts?.length ? (
        <div className={styles.content}>
          {walletNfts.map((nft) => (
            <NFTCard
              disabled={nft.disabled}
              key={nft.mint}
              imageUrl={nft.imageUrl}
              name={nft.name}
              onBtnClick={() => toggleNft(nft)}
              selected={isNftSelected(nft)}
            />
          ))}
        </div>
      ) : (
        <Title level={5}>No NFTs of this collections</Title>
      )}
    </Modal>
  );
};
