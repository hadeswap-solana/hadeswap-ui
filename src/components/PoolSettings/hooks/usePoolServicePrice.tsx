import React, { useState } from 'react';
import { Form, FormInstance } from 'antd';
import { BondingCurveType } from 'hadeswap-sdk/lib/hadeswap-core/types';
import { Pair } from '../../../state/core/types';

type UsePoolServicePrice = ({ pool }: { pool?: Pair }) => {
  formPrice: FormInstance;
  fee: number;
  spotPrice: number;
  delta: number;
  curveType: BondingCurveType;
  setCurveType: React.Dispatch<BondingCurveType>;
};

export const usePoolServicePrice: UsePoolServicePrice = ({ pool }) => {
  const [curveType, setCurveType] = useState<BondingCurveType>(
    () => pool?.bondingCurve || BondingCurveType.Exponential,
  );

  const [formPrice] = Form.useForm();
  const fee: number = Form.useWatch('fee', formPrice);
  const spotPrice: number = Form.useWatch('spotPrice', formPrice);
  const delta: number = Form.useWatch('delta', formPrice);

  return {
    formPrice,
    fee,
    spotPrice,
    delta,
    curveType,
    setCurveType,
  };
};
