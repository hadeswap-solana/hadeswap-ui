import { FC, useRef } from 'react';
import { BN } from 'hadeswap-sdk';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { helpers } from 'hadeswap-sdk/lib/hadeswap-core';
import {
  BondingCurveType,
  OrderType,
} from 'hadeswap-sdk/lib/hadeswap-core/types';
import { formatBNToString } from '../../utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface ChartLineProps {
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

const ChartLine: FC<ChartLineProps> = ({
  create,
  baseSpotPrice,
  delta,
  fee = 0,
  bondingCurve,
  buyOrdersAmount = 0,
  nftsCount = 0,
  mathCounter = 0,
  type,
}) => {
  const CHART_COLORS = {
    white: 'rgb(244, 239, 239)',
    whiteOpacity: 'rgba(244, 239, 239, 0.5)',
    red: 'rgba(246, 71, 71, 0.2)',
    green: 'rgba(102, 204, 153, 0.2)',
  };
  const ref = useRef(null);

  const spotPrice = +formatBNToString(new BN(baseSpotPrice));

  const parseDelta = (rawDelta: number, curveType: string): number => {
    return curveType === 'exponential'
      ? +((spotPrice * rawDelta) / 1e4).toFixed(2)
      : +formatBNToString(new BN(rawDelta));
  };

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

  const amountOrder = buyOrdersAmount + nftsCount;

  const labelsBuy = Array(priceArrayBuy.array.length)
    .fill(0)
    .map((_, i) => i - priceArrayBuy.array.length);

  const labelsSell = Array(priceArraySell.array.length)
    .fill(0)
    .map((_, i) => Math.abs(i - priceArraySell.array.length))
    .reverse();

  const labels = Array(amountOrder * 2)
    .fill(0)
    .map((_, i) => {
      if (i < amountOrder) return i - amountOrder;
      return Math.abs(i - amountOrder);
    });

  const typeCheck = (type: string) => {
    if (type === 'tokenForNft') {
      return { mid: labelsBuy.length, arr: [...labelsBuy, 0] };
    }
    if (type === 'nftForToken') {
      return { mid: 0, arr: [0, ...labelsSell, labelsSell.length + 1] };
    }
    if (type === 'liquidityProvision') {
      return {
        mid: labels.length / 2 + mathCounter,
        arr: [...labels, amountOrder],
      };
    }
  };

  const newType = typeCheck(type);

  const quadrants: any[] = [
    {
      beforeDraw: function (chart) {
        const {
          ctx,
          chartArea: { left, top, right, bottom },
          scales: { x, y },
        } = chart;
        const midX = x.getPixelForValue(newType.mid);
        const midY = y.getPixelForValue(1);

        ctx.save();
        ctx.fillStyle = CHART_COLORS.green;
        ctx.fillRect(left, top, midX - left, midY - top);
        ctx.fillStyle = CHART_COLORS.red;
        ctx.fillRect(midX, top, right - midX, midY - top);
        ctx.fillStyle = CHART_COLORS.red;
        ctx.fillRect(midX, midY, right - midX, bottom - midY);
        ctx.fillStyle = CHART_COLORS.green;
        ctx.fillRect(left, midY, midX - left, bottom - midY);
        ctx.restore();
      },
    },
  ];

  const arrCordBuy = priceArrayBuy.array.map((price: number, i: number) => {
    const newPrice = price / 1e9;
    return { x: -i + mathCounter, y: newPrice - newPrice * (fee / 10000) };
  });

  const arrCordSell = priceArraySell.array.map((price: number, i: number) => {
    const newPrice = price / 1e9;
    return {
      x: i + 1 + mathCounter,
      y: newPrice + newPrice * (fee / 10000),
    };
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

  const arrCordBuyLiq = priceArrayBuyLiq.array.map(
    (price: number, i: number) => {
      const newPrice = price / 1e9;
      return { x: -i + mathCounter, y: newPrice - newPrice * (fee / 10000) };
    },
  );

  const dataArr = [...arrCordBuy.reverse(), ...arrCordSell];

  const dataArrLiq = [...arrCordBuyLiq.reverse(), ...arrCordSell];

  const options: any = {
    responsive: true,
    scales: {
      x: {
        ticks: {
          stepSize: 1,
        },
      },
      y: {
        suggestedMin: 0,
        suggestedMax: spotPrice + 1,
        ticks: {
          stepSize: delta ? parseDelta(delta, bondingCurve) : 0.5,
        },
      },
    },
    tooltips: {
      enabled: false,
    },
    plugins: {
      tooltip: {
        interaction: {
          displayColors: false,
          callbacks: {
            title: () => '',
            label: (context) => 'price: ' + context.parsed.y.toFixed(3),
          },
        },
      },
      legend: {
        display: false,
      },
    },
  };

  const data = {
    labels: newType.arr,
    datasets: [
      {
        label: 'Dataset',
        data: create ? dataArrLiq : dataArr,
        borderColor: CHART_COLORS.white,
        backgroundColor: CHART_COLORS.whiteOpacity,
        pointStyle: 'circle',
        pointRadius: 10,
        pointHoverRadius: 15,
      },
    ],
  };
  return <Line ref={ref} options={options} data={data} plugins={quadrants} />;
};

export default ChartLine;
