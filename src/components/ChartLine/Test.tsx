import React, { FC, useEffect, useRef, useState } from 'react';
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
// import { SolIconSvg } from '../../icons/SolIconSvg';
import SolanaIconColor from '../../icons/SolanaIconColor.svg';
import styles from './Chart.module.scss';

const Test: FC = () => {
  const ref = useRef(null);
  ChartJS.register(Filler);

  // eslint-disable-next-line no-use-before-define
  const colors = {
    purple: {
      default: 'rgba(37, 124, 255, 1)',
      half: 'rgba(37, 124, 255, 0.4)',
      quarter: 'rgba(37, 124, 255, 0.25)',
      zero: 'rgba(37, 124, 255, 0)',
    },
    indigo: {
      default: 'rgba(80, 102, 120, 1)',
      quarter: 'rgba(80, 102, 120, 0.25)',
    },
    backgroundPoint: {
      red: 'rgba(255, 50, 37, 1)',
      green: 'rgba(37, 255, 111, 1)',
    },
  };

  const weight = [
    { y: `1`, x: 'Week 1' },
    { y: `2`, x: 'Week 2' },
    { y: `3`, x: 'Week 3' },
    { y: `4`, x: 'Week 4' },
    { y: `5`, x: 'Week 5' },
  ];

  const weight2 = [
    { y: `5`, x: 'Week 5' },
    { y: `6`, x: 'Week 6' },
    { y: `5`, x: 'Week 5' },
    { y: `7`, x: 'Week 7' },
    { y: `8`, x: 'Week 8' },
    { y: `9`, x: 'Week 9' },
  ];

  const labels = [
    'Week 1',
    'Week 2',
    'Week 3',
    'Week 4',
    'Week 5',
    'Week 6',
    'Week 7',
    'Week 8',
    'Week 9',
    'Week 10',
  ];

  // eslint-disable-next-line no-use-before-define
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
  }, []);

  const data = {
    labels: labels,
    datasets: [
      {
        data: weight,
        fill: true,
        backgroundColor: grad,
        pointBackgroundColor: colors.backgroundPoint.green,
        borderColor: colors.purple.default,
        lineTension: 0.2,
        showLine: true,
        borderWidth: 2,
        pointRadius: 7,
        pointHoverRadius: 9,
        url: 'https://www.chartjs.org/img/chartjs-logo.svg',
      },
      {
        data: weight2,
        fill: true,
        backgroundColor: grad,
        pointBackgroundColor: colors.backgroundPoint.red,
        borderColor: colors.purple.default,
        lineTension: 0.2,
        showLine: true,
        borderWidth: 2,
        pointRadius: 7,
        pointHoverRadius: 9,
        url: 'https://www.chartjs.org/img/chartjs-logo.svg',
      },
    ],
  };

  const options: any = {
    plugins: {
      tooltip: {
        backgroundColor: '#0F1720',
        borderColor: 'rgba(35, 48, 61, 1)',
        padding: 20,
        titleColor: 'rgba(83, 91, 95, 1)',
        titleFont: {
          size: 12,
        },
        interaction: {
          usePointStyle: true,
          displayColors: true,
          callbacks: {
            title: () => '2th nft',
            label: (context) => ' price: ' + context.parsed.y.toFixed(3),
            labelPointStyle: () => {
              return { pointStyle: SolanaIconColor };
            },
          },
        },
      },
      legend: {
        display: false,
      },

      title: {
        display: true,
        text: 'price graph',
        color: '#E3E2E5',
        padding: {
          // top: 110,
          bottom: 30,
        },
        font: {
          family: 'Rubik',
          size: 24,
          weight: 'bold',
        },
      },
    },
    layout: {
      padding: 24,
    },

    responsive: true,
    legend: {
      display: false,
    },

    scales: {
      x: {
        gridLines: {
          display: false,
        },
        ticks: {
          padding: 10,
          autoSkip: false,
          maxRotation: 15,
          minRotation: 15,
        },
      },

      y: {
        scaleLabel: {
          display: true,
          labelString: 'Weight in KG',
          padding: 10,
        },
        grid: {
          color: colors.indigo.quarter,
        },

        gridLines: {
          display: true,
          color: colors.indigo.quarter,
        },
        ticks: {
          beginAtZero: false,
          max: 63,
          min: 57,
          padding: 10,
        },
      },
    },
  };

  return (
    <>
      {/* <SolIconSvg /> */}
      <Line
        id="myChart"
        ref={ref}
        options={options}
        data={data}
        className={styles.canvas}
        height="80"
        // quadrants={quadrants}
      />
    </>
  );
};

export default Test;
