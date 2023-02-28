import { useEffect, useMemo, useState } from 'react';
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

interface DeltaParser {
  exponential: number;
  linear: number;
  xyk: number;
}

type UsePoolServicePrice = ({ pool }: { pool?: Pair }) => {
  formValue: FormValuePriceBlock;
  setFormValue: (prev: FormValuePriceBlock) => void;
};

const setInitialFormValue = (
  pool: Pair,
  deltaParser: DeltaParser,
): FormValuePriceBlock => {
  return {
    fee: pool?.fee / 100 || 0,
    spotPrice: pool?.currentSpotPrice / 1e9 || 0,
    delta: deltaParser[pool?.bondingCurve] || 0,
    curveType: pool?.bondingCurve || BondingCurveType.Exponential,
  };
};

export const usePoolServicePrice: UsePoolServicePrice = ({ pool }) => {
  const deltaParser = useMemo(
    () => ({
      [BondingCurveType.Exponential]: pool?.delta / 100,
      [BondingCurveType.Linear]: pool?.delta / 1e9,
      [BondingCurveType.XYK]: Math.ceil(
        (pool?.buyOrdersAmount + pool?.nftsCount) /
          (pool?.type === PairType.LiquidityProvision ? 2 : 1),
      ),
    }),
    [pool],
  );

  const [formValue, setFormValue] = useState<FormValuePriceBlock>(() =>
    setInitialFormValue(pool, deltaParser),
  );

  useEffect(() => {
    setFormValue(setInitialFormValue(pool, deltaParser));
  }, [pool, deltaParser]);

  return {
    formValue,
    setFormValue,
  };
};
