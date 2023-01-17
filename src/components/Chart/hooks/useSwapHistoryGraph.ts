import { helpers } from 'hadeswap-sdk/lib/hadeswap-core';
import {
  BondingCurveType,
  OrderType,
  PairType,
} from 'hadeswap-sdk/lib/hadeswap-core/types';
import { Point } from '../types';

type UseSwapHistoryGraph = (props: {
  baseSpotPrice: number;
  rawDelta: number;
  rawFee: number;
  bondingCurve: BondingCurveType;
  buyOrdersAmount?: number;
  nftsCount: number;
  mathCounter?: number;
  type: string;
}) => Point[] | null;

const useSwapHistoryGraph: UseSwapHistoryGraph = ({
  baseSpotPrice,
  rawDelta,
  rawFee = 0,
  bondingCurve,
  buyOrdersAmount = 0,
  nftsCount = 0,
  mathCounter = 0,
  type,
}) => {
  if (!bondingCurve || !baseSpotPrice) return null;
};

export default useSwapHistoryGraph;
