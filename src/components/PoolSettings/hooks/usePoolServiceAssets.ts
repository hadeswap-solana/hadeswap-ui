import { useState, useEffect } from 'react';
import { Form, FormInstance } from 'antd';
import { Nft } from '../../../state/core/types';
import { useFetchMarketWalletNfts } from '../../../requests';
import { useSelector } from 'react-redux';
import {
  selectMarketWalletNfts,
  selectMarketWalletNftsLoading,
} from '../../../state/core/selectors';

export interface NftWithSelect extends Nft {
  selected: boolean;
}

interface NftsByMint {
  [key: string]: NftWithSelect;
}

interface UsePoolServiceAssets {
  nfts: NftWithSelect[];
  selectedNfts: NftWithSelect[];
  toggleNft: (mint: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  nftsLoading: boolean;
  formAssets: FormInstance;
  nftAmount: number;
  buyOrdersAmount?: number;
}

const createNftsByMint = (nfts: Nft[], isSelected: boolean) => {
  if (!nfts) {
    return {};
  }

  return nfts.reduce((acc, nft) => {
    return {
      ...acc,
      [nft.mint]: { ...nft, selected: isSelected },
    };
  }, {});
};

export const usePoolServiceAssets = ({
  marketPublicKey,
  preSelectedNfts,
}: {
  marketPublicKey: string;
  preSelectedNfts?: Nft[];
}): UsePoolServiceAssets => {
  const [nftsByMint, setNftsByMint] = useState<NftsByMint>(
    createNftsByMint(preSelectedNfts, true),
  );

  useEffect(() => {
    setNftsByMint(createNftsByMint(preSelectedNfts, true));
  }, [preSelectedNfts]);

  useFetchMarketWalletNfts(marketPublicKey);

  const walletNfts = useSelector(selectMarketWalletNfts);
  const nftsLoading = useSelector(selectMarketWalletNftsLoading);

  useEffect(() => {
    setNftsByMint((prevState) => ({
      ...prevState,
      ...createNftsByMint(walletNfts, false),
    }));
  }, [walletNfts]);

  const toggleNft = (mint) => {
    setNftsByMint((prevState) => ({
      ...prevState,
      [mint]: { ...prevState[mint], selected: !prevState[mint].selected },
    }));
  };

  const nfts: NftWithSelect[] = Object.values(nftsByMint);
  const selectedNfts: NftWithSelect[] = nfts.filter((nft) => nft.selected);

  const selectAll = () => {
    setNftsByMint(createNftsByMint(nfts, true));
  };

  const deselectAll = () => {
    setNftsByMint(createNftsByMint(nfts, false));
  };

  const [formAssets] = Form.useForm();
  const nftAmount: number = Form.useWatch('nftAmount', formAssets);
  const buyOrdersAmount: number = Form.useWatch('buyOrdersAmount', formAssets);

  return {
    nfts,
    selectedNfts,
    toggleNft,
    selectAll,
    deselectAll,
    nftsLoading,
    formAssets,
    nftAmount,
    buyOrdersAmount,
  };
};
