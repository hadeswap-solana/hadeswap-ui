import { FC, useEffect } from 'react';
import { Button, Row, Col, Typography, Avatar } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useWallet } from '@solana/wallet-adapter-react';
import { PairType } from 'hadeswap-sdk/lib/hadeswap-core/types';
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
import { formatBNToString, PoolType } from '../../utils';
import { MarketInfo, Pair } from '../../state/core/types';
import { NFTCard } from '../../components/NFTCard/NFTCard';
import { createEditPollLink } from '../../constants';
import { parseDelta } from '../../state/core/helpers';
import { FakeInfinityScroll } from '../../components/FakeInfiinityScroll';

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
      <h2 className={styles.pageTitle}>
        <span>pool</span>
        <span>{poolPubkey}</span>
      </h2>
      {loading || !pool ? (
        <Spinner />
      ) : (
        <div className={styles.content}>
          <h3>
            <span>owner</span>
            <span>{pool?.assetReceiver}</span>
          </h3>
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
      <h4 className={styles.nftsListTitle}>nfts</h4>
      <FakeInfinityScroll itemsPerScroll={21} className={styles.nftsList}>
        {pool?.sellOrders?.map((order) => (
          <NFTCard
            className={styles.nftCart}
            key={order.mint}
            imageUrl={order.imageUrl}
            name={order.name}
          />
        ))}
      </FakeInfinityScroll>
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
  const isLiquidityProvisionPool = pool?.type === PairType.LiquidityProvision;
  const accumulatedFees = pool?.liquidityProvisionOrders.reduce(
    (acc, order) => acc + order.accumulatedFee,
    0,
  );

  return (
    <div className={styles.generalInfo}>
      <div className={styles.generalInfoBlockHeader}>
        <h4 className={styles.generalInfoTitle}>general Info</h4>
        {onEdit && (
          <Button type="primary" onClick={onEdit}>
            edit
          </Button>
        )}
      </div>
      <div className={styles.generalInfoBlockWrapper}>
        <div className={styles.generalInfoBlock}>
          <Title level={5}>collection</Title>
          <Row align="middle" gutter={[8, 0]}>
            <Col>
              <Avatar src={market?.collectionImage} />
            </Col>
            <Col>{market?.collectionName}</Col>
          </Row>
        </div>
        <div className={styles.generalInfoBlock}>
          <Title level={5}>pool type</Title>
          <Text className={styles.generalInfoText}>{PoolType[pool?.type]}</Text>
        </div>
        <div className={styles.generalInfoBlock}>
          <Title level={5}>SOL balance</Title>
          <Text className={styles.generalInfoText}>
            {formatBNToString(new BN(pool?.fundsSolOrTokenBalance || '0'))} SOL
          </Text>
        </div>
        <div className={styles.generalInfoBlock}>
          <Title level={5}>amount of NFTs</Title>
          <Text className={styles.generalInfoText}>
            {pool?.nftsCount || '0'}
          </Text>
        </div>
        <div className={styles.generalInfoBlock}>
          <Title level={5}>delta</Title>
          <Text className={styles.generalInfoText}>
            {parseDelta(pool?.delta, pool?.bondingCurve)}
          </Text>
        </div>
        <div className={styles.generalInfoBlock}>
          <Title level={5}>fee</Title>
          <Text className={styles.generalInfoText}>{pool?.fee / 100}%</Text>
        </div>
        <div className={styles.generalInfoBlock}>
          <Title level={5}>status</Title>
          <Text className={styles.generalInfoText}>{pool?.pairState}</Text>
        </div>
        {isLiquidityProvisionPool && (
          <div className={styles.generalInfoBlock}>
            <Title level={5}>accumulated fees</Title>
            <Text className={styles.generalInfoText}>
              {formatBNToString(new BN(accumulatedFees || '0'))} SOL
            </Text>
          </div>
        )}
      </div>
    </div>
  );
};
