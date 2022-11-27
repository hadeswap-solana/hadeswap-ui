import { FC, useEffect, useRef, useState } from 'react';
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
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { helpers } from 'hadeswap-sdk/lib/hadeswap-core';
import {
  BondingCurveType,
  OrderType,
} from 'hadeswap-sdk/lib/hadeswap-core/types';
import { formatBNToString } from '../../utils';
import styles from './Chart.module.scss';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
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

const NewChart: FC<ChartLineProps> = ({
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
  ChartJS.register(Filler);
  const colors = {
    purple: {
      default: 'rgba(149, 76, 233, 1)',
      half: 'rgba(149, 76, 233, 0.5)',
      quarter: 'rgba(149, 76, 233, 0.25)',
      zero: 'rgba(149, 76, 233, 0)',
    },
    indigo: {
      default: 'rgba(80, 102, 120, 1)',
      quarter: 'rgba(80, 102, 120, 0.25)',
    },
  };
  const [grad, setGrad] = useState<any>();

  useEffect(() => {
    const canvas = document.getElementById('myChart') as HTMLCanvasElement;

    const ctx = canvas.getContext('2d');
    ctx.canvas.height = 100;

    const gradient = ctx.createLinearGradient(0, 25, 0, 300);
    gradient.addColorStop(0, colors.purple.half);
    gradient.addColorStop(0.35, colors.purple.quarter);
    gradient.addColorStop(1, colors.purple.zero);
    setGrad(gradient);
  }, [colors.purple.half, colors.purple.quarter, colors.purple.zero]);

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
    .map((_, i) => i - priceArrayBuy.array.length)
    .splice(1, 1);

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
      return { mid: labelsBuy.length, arr: [-4, -3, -2, -1, 0] };
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
      id: 'customCanvasBackgroundColor',
      beforeDraw: (chart, args, options) => {
        const { ctx } = chart;
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = options.color || '#0F1720';
        ctx.fillRect(0, 0, chart.width, chart.height);
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
    layout: {
      padding: 24,
      borderRadius: 25,
    },
    scales: {
      x: {
        ticks: {
          stepSize: 1,
        },
        border: {
          display: true,
        },
        grid: {
          display: false,
          drawOnChartArea: false,
          drawTicks: false,
        },
      },
      y: {
        // stacked: true,
        beginAtZero: true,
        grid: {
          color: function (context) {
            if (context.tick.value > 0) {
              return '#23303D';
            } else if (context.tick.value < 0) {
              return 'red';
            }

            return '#23303D';
          },
        },
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
    // interaction: {
    //   intersect: false,
    // },
    plugins: {
      filler: {
        propagate: false,
      },
      'samples-filler-analyser': {
        target: 'chart-analyser',
      },

      title: {
        display: true,
        text: 'price graph',
        color: '#E3E2E5',
        font: {
          family: 'Rubik',
          size: 24,
          weight: 'bold',
        },
      },
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
        data: [1, 2, 3, 4, 5],
        borderColor: grad,
        backgroundColor: '#25FF6F',
        pointStyle: 'circle',
        pointRadius: 9,
        pointHoverRadius: 13,
        tension: 0.4,
        fill: true,
      },
    ],
  };
  return (
    <Line
      ref={ref}
      options={options}
      data={data}
      plugins={quadrants}
      height="80"
      className={styles.canvas}
    />
  );
};

export default NewChart;
