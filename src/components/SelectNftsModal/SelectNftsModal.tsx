import { useWallet } from '@solana/wallet-adapter-react';
import { Modal } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { coreActions } from '../../state/core/actions';
import { selectMarketWalletNfts } from '../../state/core/selectors';
import { Nft } from '../../state/core/types';
import { NFTCard } from '../NFTCard/NFTCard';
import styles from './SelectNftsModal.module.scss';

type UseSelectNftsModal = (marketPublicKey: string) => {
  visible: boolean;
  setVisible: (nextState: boolean) => void;
  selectedNfts: Nft[];
  walletNfts: Nft[];
  toggleNft: (nft: Nft) => void;
  isNftSelected: (nft: Nft) => boolean;
};

export const useSelectNftsModal: UseSelectNftsModal = (marketPublicKey) => {
  const dispatch = useDispatch();
  const { connected } = useWallet();

  const [visible, setVisible] = useState(false);
  const [selectedNfts, setSelectedNfts] = useState<Nft[]>([]);
  const walletNfts = useSelector(selectMarketWalletNfts);

  useEffect(() => {
    if (connected && marketPublicKey && !walletNfts?.length) {
      dispatch(coreActions.fetchMarketWalletNfts(marketPublicKey));
    }
  }, [dispatch, connected, marketPublicKey, walletNfts]);

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
  };
};

export const SelectNftsModal: FC<ReturnType<UseSelectNftsModal>> = ({
  visible,
  setVisible,
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
      closeIcon={<></>}
      onCancel={() => setVisible(false)}
      width={860}
    >
      <div className={styles.content}>
        {walletNfts.map((nft) => (
          <NFTCard
            key={nft.mint}
            imageUrl={nft.imageUrl}
            name={nft.name}
            onBtnClick={() => toggleNft(nft)}
            selected={isNftSelected(nft)}
          />
        ))}
      </div>
    </Modal>
  );
};
