import { FC } from 'react';
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
import { Pair } from '../../state/core/types';
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

interface IProps {
  pool: Pair;
}

const ChartLine: FC<IProps> = ({ pool }) => {
  const {
    baseSpotPrice,
    delta,
    fee,
    buyOrdersAmount,
    sellOrders,
    bondingCurve,
    nftsCount,
    mathCounter,
    type,
  } = pool;

  console.log(pool);

  const CHART_COLORS = {
    white: 'rgb(244, 239, 239)',
    whiteOpacity: 'rgba(244, 239, 239, 0.5)',
    red: 'rgba(246, 71, 71, 0.2)',
    green: 'rgba(102, 204, 153, 0.2)',
  };

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

  console.log(priceArrayBuy, 'priceArrayBuy');

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

  console.log(priceArraySell, 'priceArraySell');

  const amountOrder: number = buyOrdersAmount + sellOrders.length;

  const labelsBuy = Array(priceArrayBuy.array.length)
    .fill(0)
    .map((none, i) => {
      const half = Math.ceil(priceArrayBuy.array.length);
      if (i < half) return i - half;
    });

  const labelsSell = Array(priceArraySell.array.length)
    .fill(0)
    .map((none, i) => {
      const half = Math.ceil(priceArraySell.array.length);
      return Math.abs(i - half);
    })
    .reverse();

  const labels = Array(amountOrder * 2)
    .fill(0)
    .map((none, i) => {
      const half = Math.ceil(amountOrder);
      if (i < half) return i - half;
      else return Math.abs(i - half);
    });

  const typeCheck = (type: string) => {
    if (type === 'tokenForNft') {
      return { mid: labelsBuy.length, arr: [...labelsBuy, 0] };
    }
    if (type === 'nftForToken') {
      return { mid: 0, arr: [0, ...labelsSell] };
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
        const midX = x.getPixelForValue(newType?.mid ?? 0);
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

  const dataArr = [...arrCordBuy.reverse(), ...arrCordSell];

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
        data: dataArr,
        borderColor: CHART_COLORS.white,
        backgroundColor: CHART_COLORS.whiteOpacity,
        pointStyle: 'circle',
        pointRadius: 10,
        pointHoverRadius: 15,
      },
    ],
  };
  return <Line options={options} data={data} plugins={quadrants} />;
};

export default ChartLine;
