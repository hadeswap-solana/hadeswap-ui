import { FC, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import {
  Button,
  Card,
  Col,
  Form,
  InputNumber,
  Radio,
  Row,
  Select,
  Steps,
  Typography,
} from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useWallet } from '@solana/wallet-adapter-react';
import { web3 } from 'hadeswap-sdk';
import {
  BondingCurveType,
  PairType,
} from 'hadeswap-sdk/lib/hadeswap-core/types';

import { useConnection } from '../../hooks';
import { Spinner } from '../../components/Spinner/Spinner';
import { AppLayout } from '../../components/Layout/AppLayout';
import { coreActions } from '../../state/core/actions';
import {
  selectAllMarkets,
  selectAllMarketsLoading,
  selectCertainMarketLoading,
  selectCertainPair,
  selectCertainPairLoading,
} from '../../state/core/selectors';
import { MarketInfo } from '../../state/core/types';
import {
  SelectNftsModal,
  useSelectNftsModal,
} from '../../components/SelectNftsModal/SelectNftsModal';
import { NFTCard } from '../../components/NFTCard/NFTCard';

import styles from './EditPool.module.scss';

const { Title, Paragraph } = Typography;

export const EditPool: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const connection = useConnection();
  const wallet = useWallet();
  const location = useLocation();
  const [isEditButtonDisabled, setIsEditButtonDisabled] =
    useState<boolean>(false);
  const { poolPubKey } = useParams<{ poolPubKey: string }>();
  const pool = useSelector(selectCertainPair);
  const markets = useSelector(selectAllMarkets) as MarketInfo[];
  const poolLoading = useSelector(selectCertainPairLoading);
  const marketLoading = useSelector(selectCertainMarketLoading);
  const [form] = Form.useForm();
  const spotPrice = Form.useWatch('spotPrice', form);
  const curve = Form.useWatch('curve', form);
  const delta = Form.useWatch('delta', form);
  const nftAmount = Form.useWatch('nftAmount', form);
  const fee = Form.useWatch('fee', form);
  const chosenMarket = markets.find(
    (item) => item.marketPubkey === pool?.market,
  );
  const collectionName = chosenMarket?.collectionName ?? 'NFTs';
  const nftModal = useSelectNftsModal(
    collectionName,
    chosenMarket?.marketPubkey,
  );
  const poolNfts = pool
    ? pool?.sellOrders.concat(nftModal.selectedNfts as Array<any>)
    : nftModal.selectedNfts;
  const type = pool?.type;

  const initialValues = {
    curve: pool?.bondingCurve,
    fee: pool?.fee / 100,
    spotPrice: pool?.spotPrice / 1e9,
    delta: pool?.delta / 100,
    nftAmount: pool?.buyOrdersAmount,
    depositAmount: 0,
  };

  const loading = poolLoading || marketLoading;
  const unit = curve === BondingCurveType.Exponential ? '%' : 'SOL';
  // const deposit = (spotPrice - spotPrice * fee * 2) * buyUpTo;
  const rawSpotPrice = spotPrice * 1e9;
  const rawDelta =
    curve === BondingCurveType.Exponential ? delta * 100 : delta * 1e9;
  const rawFee = fee * 100;

  useEffect(() => {
    dispatch(coreActions.fetchAllMarkets());
    dispatch(coreActions.fetchPair(poolPubKey));
  }, [dispatch]);

  const onSelectNftsClick = () => {
    nftModal.setVisible(true);
  };

  const onFormChange = () => {
    //console.log(form.getFieldsValue(['market', 'type', 'spotPrice', 'curve']));
  };

  const onSavePoolClick = () => {
    setIsEditButtonDisabled(true);

    setIsEditButtonDisabled(false);
  };

  return (
    <AppLayout>
      <Title>Edit pool</Title>
      {loading || !pool ? (
        <Spinner />
      ) : (
        <>
          <Form
            layout="vertical"
            form={form}
            initialValues={initialValues}
            onValuesChange={onFormChange}
          >
            <div className={styles.stepsContent}>
              <div className={styles.stepContent}>
                <Row>
                  <Col span={11}>
                    <Card>
                      <Title level={3}>Pricing</Title>
                      {type === PairType.LiquidityProvision && (
                        <Form.Item
                          name="fee"
                          label="Fee Amount"
                          tooltip={{
                            title: '',
                            icon: <InfoCircleOutlined />,
                          }}
                        >
                          <InputNumber
                            className={styles.input}
                            min="0"
                            addonAfter="%"
                          />
                        </Form.Item>
                      )}
                      <Form.Item
                        name="spotPrice"
                        label="Start price"
                        tooltip={{
                          title: '',
                          icon: <InfoCircleOutlined />,
                        }}
                      >
                        <InputNumber
                          className={styles.input}
                          min="0"
                          addonAfter="SOL"
                        />
                      </Form.Item>
                      <Form.Item
                        name="curve"
                        label="Bonding Curve"
                        tooltip={{
                          title: '',
                          icon: <InfoCircleOutlined />,
                        }}
                      >
                        <Radio.Group className={styles.input} value={curve}>
                          <Radio.Button value={BondingCurveType.Linear}>
                            Linear Curve
                          </Radio.Button>
                          <Radio.Button value={BondingCurveType.Exponential}>
                            Exponential Curve
                          </Radio.Button>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item
                        name="delta"
                        label="Delta"
                        tooltip={{
                          title: '',
                          icon: <InfoCircleOutlined />,
                        }}
                      >
                        <InputNumber
                          className={styles.input}
                          addonAfter={unit}
                          min="0"
                        />
                      </Form.Item>
                      {Boolean(spotPrice) && (
                        <Paragraph>
                          You have selected a starting price of {spotPrice} SOL.
                        </Paragraph>
                      )}
                      {Boolean(delta) && (
                        <Paragraph>
                          Each time your pool {type}s an NFT, your {type} price
                          will adjust up by {delta} {unit}.
                        </Paragraph>
                      )}
                    </Card>
                  </Col>
                  <Col span={11} offset={2}>
                    {type === PairType.TokenForNFT && (
                      <Card>
                        <Title level={3}>Assets</Title>
                        <Form.Item label="Amount of NFTs" name="nftAmount">
                          <InputNumber
                            className={styles.input}
                            min="0"
                            addonAfter="NFTs"
                          />
                        </Form.Item>
                      </Card>
                    )}
                    {type === PairType.NftForToken && (
                      <Card>
                        <Title level={3}>Assets</Title>
                        <div className={styles.nftsWrapper}>
                          {poolNfts.map((nft) => (
                            <NFTCard
                              // className={styles.nfts}
                              key={nft.mint}
                              imageUrl={nft.imageUrl}
                            />
                          ))}
                        </div>
                        <Button onClick={onSelectNftsClick}>
                          + Select NFTs
                        </Button>
                      </Card>
                    )}
                    {type === PairType.LiquidityProvision && (
                      <Card>
                        <Title level={3}>Assets</Title>
                        <div className={styles.nftsWrapper}>
                          {poolNfts.map((nft) => (
                            <NFTCard
                              // className={styles.nfts}
                              key={nft.mint}
                              imageUrl={nft.imageUrl}
                            />
                          ))}
                        </div>
                        <Button onClick={onSelectNftsClick}>
                          + Select NFTs
                        </Button>
                      </Card>
                    )}
                  </Col>
                </Row>
              </div>
              <div className={styles.stepsButtons}>
                <Button
                  danger
                  type="primary"
                  onClick={onSavePoolClick}
                  disabled={isEditButtonDisabled}
                >
                  Save changes
                </Button>
              </div>
            </div>
          </Form>
          <SelectNftsModal {...nftModal} />
        </>
      )}
    </AppLayout>
  );
};
