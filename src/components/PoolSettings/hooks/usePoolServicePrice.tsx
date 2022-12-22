import React, { useState } from 'react';
import { Form, FormInstance } from 'antd';
import { BondingCurveType } from 'hadeswap-sdk/lib/hadeswap-core/types';
import { Pair } from '../../../state/core/types';

type UsePoolServicePrice = ({
  pool,
  selectedNftsAmount,
}: {
  pool?: Pair;
  selectedNftsAmount: number;
}) => {
  formPrice: FormInstance;
  fee: number;
  rawFee: number;
  spotPrice: number;
  rawSpotPrice: number;
  delta: number;
  rawDelta: number;
  curveType: BondingCurveType;
  setCurveType: React.Dispatch<BondingCurveType>;
};

export const usePoolServicePrice: UsePoolServicePrice = ({
  pool,
  selectedNftsAmount,
}) => {
  const [curveType, setCurveType] = useState<BondingCurveType>(
    () => pool?.bondingCurve || BondingCurveType.Exponential,
  );

  const [formPrice] = Form.useForm();
  const fee: number = Form.useWatch('fee', formPrice);
  const spotPrice: number = Form.useWatch('spotPrice', formPrice);
  const delta: number = Form.useWatch('delta', formPrice);

  const rawFee = fee * 100;
  const rawSpotPrice = spotPrice * 1e9;

  const calcRawDelta = (): number => {
    if (curveType === BondingCurveType.Exponential) return delta * 100;
    if (curveType === BondingCurveType.Linear) return delta * 1e9;
    return selectedNftsAmount;
  };

  const rawDelta = calcRawDelta();

  return {
    formPrice,
    fee,
    rawFee,
    spotPrice,
    rawSpotPrice,
    delta: curveType === BondingCurveType.XYK ? selectedNftsAmount : delta,
    rawDelta,
    curveType,
    setCurveType,
  };
};
