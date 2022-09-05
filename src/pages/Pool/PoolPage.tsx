import { FC, useEffect, useMemo } from 'react';
import { Button, Row, Col, Typography, Card, Avatar } from 'antd';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { AppLayout } from '../../components/Layout/AppLayout';
import { SolPrice } from '../../components/SolPrice/SolPrice';

import styles from './PoolPage.module.scss';
import {
  selectCertainPair,
  selectCertainPairLoading,
} from '../../state/core/selectors';
import { coreActions } from '../../state/core/actions';
import { Spinner } from '../../components/Spinner/Spinner';

const { Title } = Typography;

export const PoolPage: FC = () => {
  const { poolPubkey } = useParams<{ poolPubkey: string }>();

  const dispatch = useDispatch();

  useEffect(() => {
    poolPubkey && dispatch(coreActions.fetchPair(poolPubkey));
  }, [dispatch, poolPubkey]);

  const pool = useSelector(selectCertainPair);
  const loading = useSelector(selectCertainPairLoading);

  const AssetsTitle = useMemo(
    () => (
      <div className={styles.header}>
        <h3>Assets</h3>
        <div className={styles.headerButtonWrapper}>
          <Button>Withdraw all</Button>
        </div>
      </div>
    ),
    [],
  );

  const PricingTitle = useMemo(
    () => (
      <div className={styles.header}>
        <h3>Pricing</h3>
        <div className={styles.headerButtonWrapper}>
          <Button>Edit</Button>
        </div>
      </div>
    ),
    [],
  );

  const TokensTitle = useMemo(
    () => (
      <div className={styles.header}>
        <h4>Tokens</h4>
        <div className={styles.headerButtonWrapper}>
          <Button>Deposit</Button>
          <Button>Withdraw</Button>
        </div>
      </div>
    ),
    [],
  );

  const NftsTitle = useMemo(
    () => (
      <div className={styles.header}>
        <h4>NFTs</h4>
        <div className={styles.headerButtonWrapper}>
          <Button>Deposit</Button>
          <Button>Withdraw</Button>
        </div>
      </div>
    ),
    [],
  );

  return (
    <AppLayout>
      <Title>{poolPubkey}</Title>
      {loading || !pool ? (
        <Spinner />
      ) : (
        <>
          <Row gutter={20}>
            <Col span={12}>
              <Card title={AssetsTitle} bordered={false}>
                <Row gutter={[0, 10]}>
                  <Col span={24}>
                    <Card title={TokensTitle} bordered={true}>
                      {(pool?.fundsSolOrTokenBalance / 1e9).toFixed(3)}
                    </Card>
                  </Col>
                  <Col span={24}>
                    <Card title={NftsTitle} bordered={true}>
                      <div className={styles.nfts}>
                        <Avatar.Group maxCount={10}>
                          {pool?.sellOrders?.map((order, index) => (
                            <Avatar key={index} src={order.imageUrl} />
                          ))}
                        </Avatar.Group>
                        <Typography.Text>
                          {pool?.sellOrders?.length}
                        </Typography.Text>
                      </div>
                    </Card>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={12}>
              <Card title={PricingTitle} bordered={false}>
                <Row gutter={10}>
                  <Col span={8}>
                    <Card title="Current price" bordered={true}>
                      <SolPrice price={pool.spotPrice} raw />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card
                      title={`Delta [${pool.bondingCurve}]`}
                      bordered={true}
                    >
                      {(pool.delta / 1e9).toFixed(3)}
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card title="Swap fee" bordered={true}>
                      {pool.fee}%
                    </Card>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </AppLayout>
  );
};
