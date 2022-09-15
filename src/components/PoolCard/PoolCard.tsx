import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Descriptions } from 'antd';
import classNames from 'classnames';
import { SolPrice } from '../SolPrice/SolPrice';
import { Pair } from '../../state/core/types';
import styles from './PoolCard.module.scss';

interface PoolCardProps {
  pool: Pair;
}

export const PoolCard: FC<PoolCardProps> = ({
  pool: {
    pairPubkey,
    type,
    fundsSolOrTokenBalance,
    nftsCount,
    bondingCurve,
    delta,
    assetReceiver,
    pairState,
    currentSpotPrice,
    fee,
    // buyOrdersAmount,
    // market,
  },
}) => {
  return (
    <Link to={`/pools/${pairPubkey}`}>
      <div className={classNames(styles.card)}>
        <Descriptions title={pairPubkey} column={2}>
          <Descriptions.Item label="Owner">{assetReceiver}</Descriptions.Item>
          <Descriptions.Item label=""> </Descriptions.Item>
          <Descriptions.Item label="Type">{type}</Descriptions.Item>
          <Descriptions.Item label="Spot price">
            <SolPrice price={currentSpotPrice} raw />
          </Descriptions.Item>
          <Descriptions.Item label="Balance">
            {(fundsSolOrTokenBalance / 1e9).toFixed(3)}
          </Descriptions.Item>
          <Descriptions.Item label="Bonding curve">
            {bondingCurve}
          </Descriptions.Item>
          <Descriptions.Item label="Delta">
            {(delta / 1e9).toFixed(3)}
          </Descriptions.Item>
          <Descriptions.Item label="State">{pairState}</Descriptions.Item>
          <Descriptions.Item label="Fee">{fee}%</Descriptions.Item>
          <Descriptions.Item label="Amount of Nfts">
            {nftsCount}
          </Descriptions.Item>
        </Descriptions>
      </div>
    </Link>
  );
};
