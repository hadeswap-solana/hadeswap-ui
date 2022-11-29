import { select } from 'd3';
import { RefObject, useEffect, useRef } from 'react';

import { helpers } from 'hadeswap-sdk/lib/hadeswap-core';
import {
  BondingCurveType,
  OrderType,
} from 'hadeswap-sdk/lib/hadeswap-core/types';
import { Point } from './types';

export const useD3 = <T extends SVGSVGElement = SVGSVGElement>(
  renderChartFn: (selection: ReturnType<typeof select>) => void,
  dependencies: Array<any>,
): RefObject<T> => {
  const ref = useRef();

  useEffect(() => {
    renderChartFn(select(ref.current) as ReturnType<typeof select>);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return ref;
};

type UsePriceGraph = (props: {
  isCreate?: boolean;
  baseSpotPrice: number;
  delta: number;
  fee?: number;
  bondingCurve: string;
  buyOrdersAmount?: number;
  nftsCount?: number;
  mathCounter?: number;
}) => Point[] | null;

export const usePriceGraph: UsePriceGraph = ({
  isCreate = false,
  baseSpotPrice,
  delta,
  fee = 0,
  bondingCurve,
  buyOrdersAmount = 0,
  nftsCount = 0,
  mathCounter = 0,
}) => {
  if (!delta || !bondingCurve || !baseSpotPrice) return null;

  const { array: priceArrayBuy } = helpers.calculatePricesArray({
    starting_spot_price: baseSpotPrice,
    delta: delta,
    amount: buyOrdersAmount,
    bondingCurveType:
      bondingCurve === 'linear'
        ? BondingCurveType.Linear
        : BondingCurveType.Exponential,
    orderType: OrderType.Sell,
    counter: mathCounter + 1,
  }) as { array: number[]; total: number };

  const { array: priceArraySell } = helpers.calculatePricesArray({
    starting_spot_price: baseSpotPrice,
    delta: delta,
    amount: nftsCount,
    bondingCurveType:
      bondingCurve === 'linear'
        ? BondingCurveType.Linear
        : BondingCurveType.Exponential,
    orderType: OrderType.Buy,
    counter: mathCounter,
  }) as { array: number[]; total: number };

  const { array: priceArrayBuyLiquidityProvision } =
    helpers.calculatePricesArray({
      starting_spot_price: baseSpotPrice,
      delta: delta,
      amount: buyOrdersAmount + nftsCount,
      bondingCurveType:
        bondingCurve === 'linear'
          ? BondingCurveType.Linear
          : BondingCurveType.Exponential,
      orderType: OrderType.Sell,
      counter: mathCounter + 1,
    }) as { array: number[]; total: number };

  const pointsBuy: Point[] = priceArrayBuy
    .map((price, i) => {
      const newPrice = price / 1e9;
      return {
        order: mathCounter ? i + mathCounter : 1 + i + mathCounter,
        price: newPrice - newPrice * (fee / 10000),
        type: 'buy',
      };
    })
    .reverse() as Point[];

  // console.log(pointsBuy, 'pointsBuy');

  const pointsSell: Point[] = priceArraySell.map((price, i) => {
    const newPrice = price / 1e9;
    return {
      order: mathCounter ? i + mathCounter : 1 + i + mathCounter,
      price: newPrice - newPrice * (fee / 10000),
      type: 'sell',
    };
  });

  const pointsLiquidityProvision: Point[] = priceArrayBuyLiquidityProvision
    .map((price, i) => {
      const newPrice = price / 1e9;
      return {
        order: 1 + i + mathCounter,
        price: newPrice - newPrice * (fee / 10000),
        type: 'buy',
      };
    })
    .reverse() as Point[];

  console.log(pointsSell, 'pointsSell');

  console.log(pointsLiquidityProvision, 'pointsLiquidityProvision');

  return isCreate
    ? [...pointsLiquidityProvision, ...pointsSell]
    : [...pointsBuy, ...pointsSell];
};
