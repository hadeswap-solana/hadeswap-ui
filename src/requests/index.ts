import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useWallet } from '@solana/wallet-adapter-react';
import { MarketInfo, Pair, Nft } from '../state/core/types';
import { web3 } from 'hadeswap-sdk';
import {
  fetchAllMarkets,
  fetchWalletPairs,
  fetchPair,
  fetchMarketPairs,
  fetchMarket,
  fetchMarketWalletNfts,
} from './requests';
import { coreActions } from '../state/core/actions';
import { useParams } from 'react-router-dom';

const BASE_STALE_TIME = 5 * 60 * 1000; // 5 min
const SHORT_STALE_TIME = 10000; // 10 sec

export const useFetchMarketWalletNfts = (marketPubkey: string): void => {
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
    },
  );

  const nftsLoading = isLoading || isFetching;

  useEffect(() => {
    dispatch(coreActions.setMarketWalletNfts({ data, isLoading: nftsLoading }));
  }, [data, nftsLoading, dispatch]);
};

export const useFetchMarket = (publicKey: string): void => {
  const dispatch = useDispatch();

  const {
    data,
    isLoading,
    isFetching,
  }: {
    data: MarketInfo;
    isLoading: boolean;
    isFetching: boolean;
  } = useQuery(['fetchMarket', `${publicKey}`], () => fetchMarket(publicKey), {
    staleTime: BASE_STALE_TIME,
    enabled: !!publicKey,
  });

  const marketLoading = isLoading || isFetching;

  useEffect(() => {
    dispatch(coreActions.setMarket({ data, isLoading: marketLoading }));
  }, [dispatch, data, marketLoading]);
};

export const useFetchPair = (): void => {
  const dispatch = useDispatch();
  const { poolPubkey } = useParams<{ poolPubkey: string }>();

  const {
    data,
    isLoading,
    isFetching,
  }: {
    data: Pair;
    isLoading: boolean;
    isFetching: boolean;
  } = useQuery(['fetchPair', `${poolPubkey}`], () => fetchPair(poolPubkey), {
    staleTime: BASE_STALE_TIME,
    enabled: !!poolPubkey,
  });

  const pairLoading = isLoading || isFetching;

  useEffect(() => {
    dispatch(coreActions.setPair({ data, isLoading: pairLoading }));
  }, [dispatch, pairLoading, data]);
};

export const useFetchMarketPairs = (): void => {
  const dispatch = useDispatch();
  const { publicKey: marketPubkey } = useParams<{ publicKey: string }>();

  const {
    data,
    isLoading,
    isFetching,
  }: {
    data: Pair[];
    isLoading: boolean;
    isFetching: boolean;
  } = useQuery(
    ['fetchMarketPairs', `${marketPubkey}`],
    () => fetchMarketPairs(marketPubkey),
    {
      staleTime: SHORT_STALE_TIME,
      enabled: !!marketPubkey,
    },
  );

  const pairsLoading = isLoading || isFetching;

  useEffect(() => {
    dispatch(coreActions.setMarketPairs({ data, isLoading: pairsLoading }));
  }, [data, pairsLoading, dispatch]);
};

export const useFetchAllMarkets = (): void => {
  const dispatch = useDispatch();

  const {
    data,
    isLoading,
    isFetching,
  }: {
    data: MarketInfo[];
    isLoading: boolean;
    isFetching: boolean;
  } = useQuery(['fetchAllMarkets'], fetchAllMarkets, {
    staleTime: BASE_STALE_TIME,
  });

  const marketsLoading = isLoading || isFetching;

  useEffect(() => {
    dispatch(coreActions.setAllMarkets({ data, isLoading: marketsLoading }));
  }, [dispatch, data, marketsLoading]);
};

export const useFetchWalletPairs = (): void => {
  const dispatch = useDispatch();
  const { publicKey }: { publicKey: web3.PublicKey } = useWallet();

  const {
    data,
    isLoading,
    isFetching,
  }: {
    data: Pair[];
    isLoading: boolean;
    isFetching: boolean;
  } = useQuery(
    ['fetchWalletPairs', `${publicKey}`],
    () => fetchWalletPairs(publicKey),
    {
      staleTime: 10,
      enabled: !!publicKey,
    },
  );

  const walletPairsLoading = isLoading || isFetching;

  useEffect(() => {
    dispatch(
      coreActions.setWalletPairs({ data, isLoading: walletPairsLoading }),
    );
  }, [dispatch, data, walletPairsLoading]);
};
