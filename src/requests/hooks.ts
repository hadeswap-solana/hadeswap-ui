import { useParams } from 'react-router-dom';
import { Nft, Pair } from '../state/core/types';
import { useFetchMarketPairs, useFetchMarketWalletNfts } from './index';
import { useEffect } from 'react';
import { coreActions } from '../state/core/actions';
import { useDispatch } from 'react-redux';

export const useDispatchMarketPairs = (): boolean => {
  const dispatch = useDispatch();
  const { publicKey: marketPubKey } = useParams<{ publicKey: string }>();

  const {
    data,
    isLoading,
    isFetching,
  }: {
    data: Pair[];
    isLoading: boolean;
    isFetching: boolean;
  } = useFetchMarketPairs(marketPubKey);

  const pairsLoading = isLoading || isFetching;

  useEffect(() => {
    !pairsLoading && dispatch(coreActions.setMarketPairs(data));
  }, [data, pairsLoading, dispatch]);

  return pairsLoading;
};

export const useDispatchMarketWalletNfts = (): boolean => {
  const dispatch = useDispatch();
  const { publicKey: marketPubKey } = useParams<{ publicKey: string }>();

  const {
    data,
    isLoading,
    isFetching,
  }: {
    data: Nft[];
    isLoading: boolean;
    isFetching: boolean;
  } = useFetchMarketWalletNfts(marketPubKey);

  const nftsLoading = isLoading || isFetching;

  useEffect(() => {
    !nftsLoading && dispatch(coreActions.setMarketWalletNfts(data));
  }, [data, nftsLoading, dispatch]);

  return nftsLoading;
};
