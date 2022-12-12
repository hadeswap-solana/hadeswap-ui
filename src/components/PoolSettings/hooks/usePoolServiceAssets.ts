import { useState, useEffect } from 'react';
import { Form, FormInstance } from 'antd';
import { Nft } from '../../../state/core/types';
import { useFetchMarketWalletNfts } from '../../../requests';

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

const createNftsByMint = (nfts: Nft[] = [], isSelected: boolean) => {
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

  const { walletNfts, nftsLoading } = useFetchMarketWalletNfts(marketPublicKey);

  useEffect(() => {
    !nftsLoading &&
      setNftsByMint((prevState) => ({
        ...prevState,
        ...createNftsByMint(walletNfts, false),
      }));
  }, [walletNfts, nftsLoading]);

  const toggleNft = (mint: string): void => {
    setNftsByMint((prevState) => ({
      ...prevState,
      [mint]: { ...prevState[mint], selected: !prevState[mint].selected },
    }));
  };

  const nfts: NftWithSelect[] = Object.values(nftsByMint);
  const selectedNfts: NftWithSelect[] = nfts.filter((nft) => nft.selected);

  const selectAll = (): void => {
    setNftsByMint(createNftsByMint(nfts, true));
  };

  const deselectAll = (): void => {
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
