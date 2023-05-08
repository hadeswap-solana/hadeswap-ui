import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { web3 } from 'hadeswap-sdk';
import { useWallet } from '@solana/wallet-adapter-react';
import { FetchStatus, QueryStatus, useQuery } from '@tanstack/react-query';
import { Nft, Pair } from '../../state/core/types';
import {
  fetchMarketWalletNfts,
  fetchWalletAllFees,
  fetchWalletPairs,
} from './requests';
import { coreActions } from '../../state/core/actions';
import { SHORT_STALE_TIME } from '../constants';
import { FetchingStatus, LoadingStatus } from '../types';

export const useFetchMarketWalletNfts = (
  marketPubkey: string,
): {
  walletNfts: Nft[];
  nftsLoading: boolean;
} => {
  const dispatch = useDispatch();
  const { publicKey }: { publicKey: web3.PublicKey } = useWallet();
  const walletPubkey: string = publicKey?.toBase58();

  const {
    data,
    isLoading,
    isFetching,
  }: {
    data: Nft[];
    isLoading: boolean;
    isFetching: boolean;
  } = useQuery(
    ['fetchMarketWalletNfts', `${marketPubkey}`, `${walletPubkey}`],
    () =>
      fetchMarketWalletNfts({
        walletPubkey,
        marketPubkey,
      }),
    {
      staleTime: SHORT_STALE_TIME,
      enabled: !!walletPubkey && !!marketPubkey,
      refetchOnWindowFocus: false,
    },
  );

  const nftsLoading = isLoading || isFetching;

  useEffect(() => {
    dispatch(coreActions.setMarketWalletNfts({ data, isLoading: nftsLoading }));
  }, [data, nftsLoading, dispatch]);

  return {
    walletNfts: data,
    nftsLoading,
  };
};

export const useFetchWalletPairs = (): void => {
  const dispatch = useDispatch();
  const { publicKey }: { publicKey: web3.PublicKey } = useWallet();
  const walletPubkey = publicKey?.toBase58();

  const {
    data,
    status,
    fetchStatus,
  }: {
    data: Pair[];
    status: QueryStatus;
    fetchStatus: FetchStatus;
  } = useQuery(
    ['fetchWalletPairs', `${walletPubkey}`],
    () => fetchWalletPairs(walletPubkey),
    {
      staleTime: 10,
      enabled: !!walletPubkey,
      refetchOnWindowFocus: false,
    },
  );

  const walletPairsLoading =
    status === LoadingStatus.loading || fetchStatus === FetchingStatus.fetching;

  useEffect(() => {
    dispatch(
      coreActions.setWalletPairs({ data, isLoading: walletPairsLoading }),
    );
  }, [dispatch, data, walletPairsLoading]);
};

export const useFetchWalletAllFees = (): {
  totalFee: string;
  loading: boolean;
} => {
  const { publicKey }: { publicKey: web3.PublicKey } = useWallet();
  const walletPubkey = publicKey?.toBase58();

  const { data, isFetching } = useQuery(
    ['walletPubkey'],
    () => fetchWalletAllFees(walletPubkey),
    {
      enabled: !!walletPubkey,
    },
  );

  const totalFee = data?.totalFee ? data?.totalFee.toFixed(2) : '0';

  return {
    totalFee,
    loading: isFetching,
  };
};
