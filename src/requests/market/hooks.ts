import { useDispatch } from 'react-redux';
import { MarketInfo } from '../../state/core/types';
import { FetchStatus, QueryStatus, useQuery } from '@tanstack/react-query';
import { fetchMarket, fetchAllMarkets } from './requsts';
import { useEffect } from 'react';
import { coreActions } from '../../state/core/actions';
import { BASE_STALE_TIME } from '../constants';
import { FetchingStatus, LoadingStatus } from '../types';

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
    refetchOnWindowFocus: false,
  });

  const marketLoading = isLoading || isFetching;

  useEffect(() => {
    dispatch(coreActions.setMarket({ data, isLoading: marketLoading }));
  }, [dispatch, data, marketLoading]);
};

export const useFetchAllMarkets = (): void => {
  const dispatch = useDispatch();

  const {
    data,
    status,
    fetchStatus,
  }: {
    data: MarketInfo[];
    status: QueryStatus;
    fetchStatus: FetchStatus;
  } = useQuery(['fetchAllMarkets'], fetchAllMarkets, {
    staleTime: BASE_STALE_TIME,
    refetchOnWindowFocus: false,
  });

  const marketsLoading =
    status === LoadingStatus.loading || fetchStatus === FetchingStatus.fetching;

  useEffect(() => {
    dispatch(coreActions.setAllMarkets({ data, isLoading: marketsLoading }));
  }, [dispatch, data, marketsLoading]);
};
