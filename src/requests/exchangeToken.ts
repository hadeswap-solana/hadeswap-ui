import { useQuery } from '@tanstack/react-query';
import { fetchTokensRate, fetchTokensInfo } from './requests';
import { TokenInfo, TokenRateData } from './types';
import { Tokens } from '../types';

export const SECOND_TO_REFRESH = 30 * 1000;

export const useTokenInfo = (): {
  tokensData: TokenInfo[];
  tokensLoading: boolean;
  tokensFetching: boolean;
} => {
  const { data, isLoading, isFetching } = useQuery(
    ['getTokens'],
    fetchTokensInfo,
    {
      staleTime: SECOND_TO_REFRESH,
    },
  );

  return {
    tokensData: data,
    tokensLoading: isLoading,
    tokensFetching: isFetching,
  };
};

export const useTokenRate = ({
  inputToken,
}: {
  inputToken: Tokens;
}): {
  tokenRate: TokenRateData;
  rateFetching: boolean;
  rateLoading: boolean;
} => {
  const { data, isFetching, isLoading } = useQuery(
    [inputToken],
    () => fetchTokensRate({ inputToken }),
    {
      staleTime: SECOND_TO_REFRESH,
    },
  );

  return {
    tokenRate: data,
    rateFetching: isFetching,
    rateLoading: isLoading,
  };
};
