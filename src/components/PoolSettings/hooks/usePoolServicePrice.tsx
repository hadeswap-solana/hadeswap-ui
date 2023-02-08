import { useState } from 'react';
import {
  BondingCurveType,
  PairType,
} from 'hadeswap-sdk/lib/hadeswap-core/types';
import { Pair } from '../../../state/core/types';

export interface FormValuePriceBlock {
  fee: number;
  spotPrice: number;
  delta: number;
  curveType: BondingCurveType;
}

type UsePoolServicePrice = ({ pool }: { pool?: Pair }) => {
  formValue: FormValuePriceBlock;
  setFormValue: (prev: FormValuePriceBlock) => void;
};

export const usePoolServicePrice: UsePoolServicePrice = ({ pool }) => {
  const deltaParser = {
    [BondingCurveType.Exponential]: pool?.delta / 100,
    [BondingCurveType.Linear]: pool?.delta / 1e9,
    [BondingCurveType.XYK]: Math.ceil(
      (pool?.buyOrdersAmount + pool?.nftsCount) /
        (pool?.type === PairType.LiquidityProvision ? 2 : 1),
    ),
  };

  const [formValue, setFormValue] = useState<FormValuePriceBlock>({
    fee: pool?.fee / 100 || 0,
    spotPrice: pool?.currentSpotPrice / 1e9 || 0,
    delta: deltaParser[pool?.bondingCurve] || 0,
    curveType: pool?.bondingCurve || BondingCurveType.Exponential,
  });

  return {
    formValue,
    setFormValue,
  };
};
