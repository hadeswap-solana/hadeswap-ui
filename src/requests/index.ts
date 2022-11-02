import { useQuery, useQueries, useQueryClient } from '@tanstack/react-query';

export interface QueryProps {
  queryKey: string[];
  queryFn: () => Promise<void>;
  cacheTime: number;
}

interface QueryResponse {
  data: [];
  isLoading: boolean;
}

type QueryRequest = ({ queryKey, queryFn }: QueryProps) => QueryResponse;

type MultiQueryRequest = (queriesData: QueryProps[]) => {
  data: any;
  isLoading: boolean;
};

export const useFetch: QueryRequest = ({ queryKey, queryFn, cacheTime }) => {
  const queryClient = useQueryClient();
  const queryEnabled = !queryClient.getQueryData(queryKey);

  const { data, isLoading }: QueryResponse = useQuery(queryKey, queryFn, {
    enabled: queryEnabled,
    cacheTime: cacheTime,
  });

  return {
    data,
    isLoading,
  };
};

export const useFetchMultiple: MultiQueryRequest = (queriesData) => {
  const queryClient = useQueryClient();

  const queries = queriesData.map((query) => ({
    queryKey: query.queryKey,
    queryFn: query.queryFn,
    enabled: !queryClient.getQueryData(query.queryKey),
    cacheTime: query.cacheTime,
  }));

  const response = useQueries({ queries });
  const data = response.map((item) => item.data);
  const isLoading = response.some((item) => item.isLoading);

  return {
    data,
    isLoading,
  };
};
