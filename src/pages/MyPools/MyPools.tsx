import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from 'antd';

import { AppLayout } from '../../components/Layout/AppLayout';
import { coreActions } from '../../state/core/actions';
import { selectWalletPairs } from '../../state/core/selectors';
import { PoolCard } from '../../components/PoolCard/PoolCard';
import styles from './MyPools.module.scss';

const { Title, Text } = Typography;

export const MyPools: FC = () => {
  const dispatch = useDispatch();
  const pools = useSelector(selectWalletPairs);

  console.log(pools);

  useEffect(() => {
    dispatch(coreActions.fetchWalletPairs());
  }, [dispatch]);

  return (
    <AppLayout>
      <Title>My pools</Title>
      <div className={styles.pools}>
        {pools.map((pool, index) => (
          <PoolCard key={index} pool={pool} />
        ))}
      </div>
    </AppLayout>
  );
};
