import { FC, useEffect } from 'react';
import { Button, Row, Col, Typography, Avatar } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useWallet } from '@solana/wallet-adapter-react';

import { AppLayout } from '../../components/Layout/AppLayout';

import styles from './PoolPage.module.scss';
import {
  selectCertainMarket,
  selectCertainMarketLoading,
  selectCertainPair,
  selectCertainPairLoading,
} from '../../state/core/selectors';
import { coreActions } from '../../state/core/actions';
import { Spinner } from '../../components/Spinner/Spinner';
import { BN } from 'hadeswap-sdk';
import { formatBNToString } from '../../utils';
import { MarketInfo, Pair } from '../../state/core/types';
import { NFTCard } from '../../components/NFTCard/NFTCard';
import { createEditPollLink } from '../../constants';

const { Title, Text } = Typography;

export const PoolPage: FC = () => {
  const { poolPubkey } = useParams<{ poolPubkey: string }>();

  const history = useHistory();
  const dispatch = useDispatch();
  const pool = useSelector(selectCertainPair);
  const market = useSelector(selectCertainMarket);
  const poolLoading = useSelector(selectCertainPairLoading);
  const marketLoading = useSelector(selectCertainMarketLoading);
  const wallet = useWallet();

  const isOwner =
    wallet.publicKey && wallet.publicKey?.toBase58() === pool?.assetReceiver;

  useEffect(() => {
    if (poolPubkey) {
      dispatch(coreActions.fetchPair(poolPubkey));
    }
  }, [dispatch, poolPubkey]);

  useEffect(() => {
    if (pool) {
      dispatch(coreActions.fetchMarket(pool?.market));
    }
  }, [dispatch, pool]);

  const loading = poolLoading || marketLoading;

  const onEdit = () => {
    history.push(createEditPollLink(poolPubkey));
  };

  return (
    <AppLayout>
      <Title level={2} style={{ marginBottom: 0 }}>
        Pool {poolPubkey}
      </Title>
      {loading || !pool ? (
        <Spinner />
      ) : (
        <div className={styles.content}>
          <Title level={5} style={{ marginBottom: 16 }}>
            Owner {pool?.assetReceiver}
          </Title>
          <PoolGeneralInfo
            pool={pool}
            market={market}
            onEdit={isOwner && onEdit}
          />
          {!!pool?.sellOrders?.length && <NftList pool={pool} />}
        </div>
      )}
    </AppLayout>
  );
};

interface NftListProps {
  pool: Pair;
}

const NftList: FC<NftListProps> = ({ pool }) => {
  return (
    <div className={styles.nftsListContainer}>
      <Title
        level={4}
        className={styles.nftsListTitle}
        style={{ marginBottom: 0 }}
      >
        NFTs
      </Title>
      <div className={styles.nftsList}>
        {pool?.sellOrders?.map((order) => (
          <NFTCard
            className={styles.nftCart}
            key={order.mint}
            imageUrl={order.imageUrl}
            name={order.name}
          />
        ))}
      </div>
    </div>
  );
};

interface PoolGeneralInfoProps {
  pool: Pair;
  market: MarketInfo;
  onEdit?: () => void;
}

const PoolGeneralInfo: FC<PoolGeneralInfoProps> = ({
  pool,
  market,
  onEdit = () => {},
}) => {
  return (
    <div className={styles.generalInfo}>
      <Title
        level={4}
        className={styles.generalInfoTitle}
        style={{ marginBottom: 0 }}
      >
        General Info
        {onEdit && (
          <Button type="primary" onClick={onEdit}>
            Edit
          </Button>
        )}
      </Title>
      <div className={styles.generalInfoBlock}>
        <Title level={5}>Collection</Title>
        <Row align="middle" gutter={[8, 0]}>
          <Col>
            <Avatar src={market?.collectionImage} />
          </Col>
          <Col>{market?.collectionName}</Col>
        </Row>
      </div>
      <div className={styles.generalInfoBlock}>
        <Title level={5}>Pool type</Title>
        <Text className={styles.generalInfoText}>{pool?.type}</Text>
      </div>
      <div className={styles.generalInfoBlock}>
        <Title level={5}>SOL balance</Title>
        <Text className={styles.generalInfoText}>
          {formatBNToString(new BN(pool?.fundsSolOrTokenBalance || '0'))} SOL
        </Text>
      </div>
      <div className={styles.generalInfoBlock}>
        <Title level={5}>NFTS amount</Title>
        <Text className={styles.generalInfoText}>{pool?.nftsCount || '0'}</Text>
      </div>
      <div className={styles.generalInfoBlock}>
        <Title level={5}>Delta</Title>
        <Text className={styles.generalInfoText}>
          {formatBNToString(new BN(pool?.delta || '0'))}
          {pool?.bondingCurve === 'linear' ? ' SOL' : '%'}
        </Text>
      </div>
      <div className={styles.generalInfoBlock}>
        <Title level={5}>Status</Title>
        <Text className={styles.generalInfoText}>{pool?.pairState}</Text>
      </div>
    </div>
  );
};
