import { useLayoutEffect, useRef, useState, FC } from 'react';
import { BN } from 'hadeswap-sdk';

import { renderChart } from './d3/renderChart';
import { data as mockData } from './mockData';
import styles from './Chart.module.scss';
import { useD3 } from './hooks';
import { formatBNToString } from '../../utils';
import { helpers } from 'hadeswap-sdk/lib/hadeswap-core';
import {
  BondingCurveType,
  OrderType,
} from 'hadeswap-sdk/lib/hadeswap-core/types';

interface ChartProps {
  className?: string;
  create?: boolean;
  baseSpotPrice: number;
  delta: number;
  fee: number;
  bondingCurve: string;
  buyOrdersAmount: number;
  nftsCount: number;
  mathCounter?: number;
  type: string;
}

export const Chart: FC<ChartProps> = ({
  className,
  create,
  baseSpotPrice = 0,
  delta,
  fee = 0,
  bondingCurve,
  buyOrdersAmount = 0,
  nftsCount = 0,
  mathCounter = 0,
}) => {
  // const data = mockData;

  const amountOrder = buyOrdersAmount + nftsCount;

  const priceArrayBuy = helpers.calculatePricesArray({
    starting_spot_price: baseSpotPrice,
    delta: delta,
    amount: buyOrdersAmount,
    bondingCurveType:
      bondingCurve === 'linear'
        ? BondingCurveType.Linear
        : BondingCurveType.Exponential,
    orderType: OrderType.Sell,
    counter: mathCounter + 1,
  });

  const priceArraySell = helpers.calculatePricesArray({
    starting_spot_price: baseSpotPrice,
    delta: delta,
    amount: nftsCount,
    bondingCurveType:
      bondingCurve === 'linear'
        ? BondingCurveType.Linear
        : BondingCurveType.Exponential,
    orderType: OrderType.Buy,
    counter: mathCounter,
  });

  const priceArrayBuyLiq = helpers.calculatePricesArray({
    starting_spot_price: baseSpotPrice,
    delta: delta,
    amount: amountOrder,
    bondingCurveType:
      bondingCurve === 'linear'
        ? BondingCurveType.Linear
        : BondingCurveType.Exponential,
    orderType: OrderType.Sell,
    counter: mathCounter + 1,
  });

  const arrCordBuy = priceArrayBuy.array
    .map((price: number, i: number) => {
      const newPrice = price / 1e9;
      return {
        order: mathCounter ? i + mathCounter : 1 + i + mathCounter,
        price: newPrice - newPrice * (fee / 10000),
        type: 'buy',
      };
    })
    .reverse();

  // console.log(arrCordBuy, 'arrCordBuy');

  const arrCordSell = priceArraySell.array.map((price: number, i: number) => {
    const newPrice = price / 1e9;
    return {
      order: mathCounter ? i + mathCounter : 1 + i + mathCounter,
      price: newPrice - newPrice * (fee / 10000),
      type: 'sell',
    };
  });

  const arrCordBuyLiq = priceArrayBuyLiq.array
    .map((price: number, i: number) => {
      const newPrice = price / 1e9;
      return {
        order: 1 + i + mathCounter,
        price: newPrice - newPrice * (fee / 10000),
        type: 'buy',
      };
    })
    .reverse();
  // console.log(arrCordBuyLiq, 'arrCordBuyLiq');

  const dataArrLiq = [...arrCordBuyLiq, ...arrCordSell];
  const dataMain = [...arrCordBuy, ...arrCordSell];
  const data = create ? dataArrLiq : dataMain;

  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useLayoutEffect(() => {
    setContainerWidth(containerRef.current?.offsetWidth);
  }, []);

  const svgRef = useD3(
    renderChart(data, {
      canvasSize: { x: containerWidth, y: 250 },
    }),
    [data, containerWidth],
  );

  return (
    <div ref={containerRef} className={`${styles.root} ${className || ''}`}>
      <svg ref={svgRef} preserveAspectRatio="xMinYMin meet" />
    </div>
  );
};
