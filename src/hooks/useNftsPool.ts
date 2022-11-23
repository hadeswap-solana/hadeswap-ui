import { Nft, PairSellOrder } from '../state/core/types';
import { useFetchMarketWalletNfts } from '../requests';
import { useSelector } from 'react-redux';
import {
  selectMarketWalletNfts,
  selectMarketWalletNftsLoading,
} from '../state/core/selectors';
import { useState } from 'react';

interface SelectedNftsByMint {
  [key: string]: Nft;
}

export interface NftsData {
  nfts: Nft[];
  selectedNfts: Nft[];
  selectedNftsByMint: SelectedNftsByMint;
  toggleNft: (nft: Nft) => void;
  nftsLoading: boolean;
}

type UseNftsPool = ({
  marketPublicKey,
  preSelectedNfts,
}: {
  marketPublicKey: string;
  preSelectedNfts?: PairSellOrder[];
}) => NftsData;

const setInitialSelectedNftsState = (preSelectedNfts): SelectedNftsByMint => {
  return preSelectedNfts.reduce((acc, item) => {
    return {
      ...acc,
      [item.mint]: item,
    };
  }, {});
};

export const useNftsPool: UseNftsPool = ({
  marketPublicKey,
  preSelectedNfts = [],
}) => {
  const [selectedNftsByMint, setSelectedNftsByMint] =
    useState<SelectedNftsByMint>(() =>
      setInitialSelectedNftsState(preSelectedNfts),
    );
  const selectedNfts = Object.values(selectedNftsByMint);

  useFetchMarketWalletNfts(marketPublicKey);

  const walletNfts = useSelector(selectMarketWalletNfts);
  const isLoading = useSelector(selectMarketWalletNftsLoading);

  const nfts = [...walletNfts, ...preSelectedNfts];

  const toggleNft = (nft) => {
    const newState = { ...selectedNftsByMint };
    if (selectedNftsByMint[nft.mint]) {
      delete newState[nft.mint];
    } else {
      newState[nft.mint] = nft;
    }
    setSelectedNftsByMint(newState);
  };

  return {
    nfts,
    selectedNfts,
    selectedNftsByMint,
    toggleNft,
    nftsLoading: isLoading,
  };
};
