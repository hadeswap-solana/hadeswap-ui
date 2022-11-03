import { FC } from 'react';
import { AppLayout } from '../../components/Layout/AppLayout';
import logoImg from '../../assets/Logo.svg';
import styles from './Home.module.scss';
import { Typography } from 'antd';
import { NavLink } from 'react-router-dom';
import { PATHS } from '../../constants';
import { useQuery } from '@tanstack/react-query';
import solanaLogo from '../../assets/icons/svg/solana-sol-logo.svg';
import { formatPriceNumber } from '../../utils/solanaUtils';
import TopMarkets, { IMarket } from '../../components/TopMarkets/TopMarkets';

const useStats = () => {
  return useQuery(
    ['stats'],
    async () => {
      const [allStats, volume24] = await Promise.all([
        fetchAllStats(),
        fetchVolume24(),
      ]);
      return createData({
        volume24,
        volume: allStats.volume,
        TVL: allStats.TVL,
      });
    },
    {
      networkMode: 'offlineFirst',
      initialData: createData({}),
    },
  );
};

const Stats: FC = () => {
  const { data } = useStats();

  return (
    <div className={styles.stats}>
      {Object.entries(data).map(([label, value]) => (
        <div className={styles.statsBlock} key={label}>
          <p className={styles.statsLabel}>{label}</p>
          <p className={styles.statsNumber}>
            {value ? formatPriceNumber.format(parseFloat(value)) : '--'}
            <img className={styles.solLogo} src={solanaLogo} alt={'SOL'} />
          </p>
        </div>
      ))}
    </div>
  );
};

export const Home: FC = () => {
  const response = useQuery(['top20', []], fetchTop);

  return (
    <AppLayout hideFooter contentClassName={styles.content}>
      <div className={styles.root}>
        <img src={logoImg} alt="Logo" className={styles.logo} />
        <Stats />
        <Typography.Title level={1} className={styles.title}>
          the best NFT marketplace <br />
          on <span className={styles.solanaWord}>Solana</span> for traders
          <br />
        </Typography.Title>

        <p className={styles.zeroFees}>0% fees</p>
      </div>
      {!response?.data?.error && (
        <TopMarkets data={response.data} isLoading={response.isLoading} />
      )}
    </AppLayout>
  );
};

const createData = ({
  TVL = null,
  volume = null,
  volume24 = null,
}: {
  TVL?: string;
  volume?: string;
  volume24?: string;
}) => {
  return {
    '24h volume': volume24,
    'all time volume': volume,
    'total value locked': TVL,
  };
};

const fetchAllStats = async (): Promise<{
  TVL: string;
  volume: string;
}> =>
  await (
    await fetch(
      `https://${process.env.BACKEND_DOMAIN}/stats/all?$volumePeriod=all`,
    )
  ).json();

const fetchVolume24 = async (): Promise<string> => {
  const data: { volume: string } = await (
    await fetch(
      `https://${process.env.BACKEND_DOMAIN}/stats/volume?volumePeriod=daily`,
    )
  ).json();

  return data.volume;
};

const fetchTop = async () =>
  await (
    await fetch(`https://${process.env.BACKEND_DOMAIN}/stats/volume24h`)
  ).json();
