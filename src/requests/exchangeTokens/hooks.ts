import { useQuery } from '@tanstack/react-query';
import { fetchTokensRate, fetchTokensInfo } from './requests';
import { TokenInfo, TokenRateData } from '../types';
import { TokensValues } from '../../types';

export const SECOND_TO_REFRESH = 30 * 1000;

export const useTokenInfo = ({
  tokenValue,
}: {
  tokenValue: TokensValues;
}): {
  tokensData: TokenInfo[];
  tokensLoading: boolean;
  tokensFetching: boolean;
} => {
  const { data, isLoading, isFetching } = useQuery(
    ['getTokens'],
    fetchTokensInfo,
    {
      staleTime: SECOND_TO_REFRESH,
      enabled: !!tokenValue,
      refetchOnWindowFocus: false,
    },
  );

  return {
    tokensData: data,
    tokensLoading: isLoading,
    tokensFetching: isFetching,
  };
};

export const useTokenRate = ({
  tokenValue,
}: {
  tokenValue: TokensValues;
}): {
  tokenRate: TokenRateData;
  rateFetching: boolean;
  rateLoading: boolean;
} => {
  const { data, isFetching, isLoading } = useQuery(
    [tokenValue],
    () => fetchTokensRate({ tokenValue }),
    {
      staleTime: SECOND_TO_REFRESH,
      enabled: !!tokenValue,
    },
  );

  return {
    tokenRate: data,
    rateFetching: isFetching,
    rateLoading: isLoading,
  };
};
