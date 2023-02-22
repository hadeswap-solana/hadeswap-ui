import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchPair, fetchMarketPairs } from './requests';
import { useEffect } from 'react';
import { coreActions } from '../../state/core/actions';
import { BASE_STALE_TIME, SHORT_STALE_TIME } from '../constants';
import { Pair } from '../../state/core/types';

type UseFetchPair = () => { refetch: () => void };

export const useFetchPair: UseFetchPair = () => {
  const dispatch = useDispatch();
  const { poolPubkey } = useParams<{ poolPubkey: string }>();

  const { data, isLoading, isFetching, refetch } = useQuery(
    ['fetchPair', `${poolPubkey}`],
    () => fetchPair(poolPubkey),
    {
      staleTime: BASE_STALE_TIME,
      enabled: !!poolPubkey,
      refetchOnWindowFocus: false,
    },
  );

  const pairLoading = isLoading || isFetching;

  useEffect(() => {
    dispatch(coreActions.setPair({ data, isLoading: pairLoading }));
  }, [dispatch, pairLoading, data]);

  return {
    refetch,
  };
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
      refetchOnWindowFocus: false,
    },
  );

  const pairsLoading = isLoading || isFetching;

  useEffect(() => {
    dispatch(coreActions.setMarketPairs({ data, isLoading: pairsLoading }));
  }, [data, pairsLoading, dispatch]);
};
