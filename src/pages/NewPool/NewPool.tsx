import { FC, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
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
} from '../../state/core/selectors';
import { MarketInfo } from '../../state/core/types';
import {
  SelectNftsModal,
  useSelectNftsModal,
} from '../../components/SelectNftsModal/SelectNftsModal';
import { NFTCard } from '../../components/NFTCard/NFTCard';
import { createPairTxn } from '../../utils/transactions/createPairTxn';
import { createTokenForNftPairTxn } from '../../utils/transactions/createTokenForNftPairTxn';
import { signAndSendTransaction } from '../../utils/transactions';
import { signAndSendTransactionsInSeries } from '../../components/Layout/helpers';
import { createDepositNftsToPairTxns } from '../../utils/transactions/createDepositNftsToPairTxns';
import { createDepositLiquidityToPairTxns } from '../../utils/transactions/createDepositLiquidityToPairTxns';

import styles from './NewPool.module.scss';

const { Step } = Steps;
const { Title, Paragraph } = Typography;
const { Option } = Select;

export const NewPool: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const connection = useConnection();
  const wallet = useWallet();
  const [isCreatePoolButtonDisabled, setIsCreatePoolButtonDisabled] =
    useState<boolean>(false);
  const { marketPubkeyParam, sideParam } = useParams<{
    marketPubkeyParam: string;
    sideParam: string;
  }>();
  const collectionsLoading = useSelector(selectAllMarketsLoading);
  const markets = useSelector(selectAllMarkets) as MarketInfo[];
  const [step, setStep] = useState<number>(marketPubkeyParam ? 1 : 0);
  const [form] = Form.useForm();
  const market = form.getFieldValue('market');
  const side = form.getFieldValue('side') ?? sideParam;
  const spotPrice = Form.useWatch('spotPrice', form);
  const curve = Form.useWatch('curve', form);
  const delta = Form.useWatch('delta', form);
  const depositAmount = Form.useWatch('depositAmount', form);
  const nftAmount = Form.useWatch('nftAmount', form);
  const fee = Form.useWatch('fee', form);
  const buyUpTo = Form.useWatch('buyUpTo', form);
  const sellUpTo = Form.useWatch('sellUpTo', form);
  const chosenMarket = markets.find((item) => item.marketPubkey === market);
  const collectionName = chosenMarket?.collectionName ?? 'NFTs';
  const nftModal = useSelectNftsModal(
    collectionName,
    chosenMarket?.marketPubkey,
  );

  // buy createTokenForNftPairTxn
  // sell createPairTxn createDepositNftsToPairTxns
  // liquidity createPairTxn createDepositLiquidityToPairTxns

  const initialValues = {
    market: market ?? marketPubkeyParam,
    side,
    curve: BondingCurveType.Linear,
    fee: 0,
    spotPrice: 0,
    delta: 0,
    buyUpTo: 0,
    sellUpTo: 0,
    nftAmount: 0,
    depositAmount: 0,
  };

  const unit = curve === BondingCurveType.Exponential ? '%' : 'SOL';
  const deposit = (spotPrice - spotPrice * fee * 2) * buyUpTo;
  const rawSpotPrice = spotPrice * 1e9;
  const rawDelta =
    curve === BondingCurveType.Exponential ? delta * 100 : delta * 1e9;
  const rawFee = fee * 100;

  useEffect(() => {
    dispatch(coreActions.fetchAllMarkets());
  }, [dispatch]);

  const onSelectChange = useCallback((value: string) => {
    setStep(1);
  }, []);

  const onRadioChange = useCallback(() => {
    setStep(2);
  }, []);

  const onBackClick = useCallback(() => {
    setStep(step - 1);
  }, [step]);

  const onNextClick = useCallback(() => {
    setStep(step + 1);
  }, [step]);

  const onSelectNftsClick = () => {
    nftModal.setVisible(true);
  };

  const onFormChange = () => {
    //console.log(form.getFieldsValue(['market', 'side', 'spotPrice', 'curve']));
  };

  const onCreatePoolClick = async () => {
    setIsCreatePoolButtonDisabled(true);
    if (side === PairType.TokenForNFT) {
      const txn = await createTokenForNftPairTxn({
        connection,
        wallet,
        marketPubkey: new web3.PublicKey(market),
        bondingCurveType: curve,
        pairType: PairType.TokenForNFT,
        delta: rawDelta,
        spotPrice: rawSpotPrice,
        amountOfOrders: nftAmount,
      });

      try {
        await signAndSendTransaction({
          ...txn,
          connection,
          wallet,
          commitment: 'finalized',
        });
        history.push('/my-pools');
      } catch (error) {
        console.error(error);
      }
    } else if (side === PairType.NftForToken) {
      const pairTxn = await createPairTxn({
        connection,
        wallet,
        marketPubkey: new web3.PublicKey(market),
        bondingCurveType: curve,
        pairType: PairType.NftForToken,
        delta: rawDelta,
        spotPrice: rawSpotPrice,
        fee: rawFee,
      });

      const depositTxn = await createDepositNftsToPairTxns({
        connection,
        wallet,
        pairPubkey: pairTxn.pairPubkey,
        authorityAdapter: pairTxn.authorityAdapterPubkey,
        nfts: nftModal.selectedNfts,
      });

      const isSuccess = await signAndSendTransactionsInSeries({
        txnData: [
          { signers: pairTxn.signers, transaction: pairTxn.transaction },
          { signers: depositTxn.signers, transaction: depositTxn.transaction },
        ],
        connection,
        wallet,
      });

      if (isSuccess) {
        history.push('/my-pools');
      }
    } else if (side === PairType.LiquidityProvision) {
      const pairTxn = await createPairTxn({
        connection,
        wallet,
        marketPubkey: new web3.PublicKey(market),
        bondingCurveType: curve,
        pairType: PairType.LiquidityProvision,
        delta: rawDelta,
        spotPrice: rawSpotPrice,
        fee: rawFee,
      });

      const depositTxn = await createDepositLiquidityToPairTxns({
        connection,
        wallet,
        pairPubkey: pairTxn.pairPubkey,
        authorityAdapter: pairTxn.authorityAdapterPubkey,
        nfts: nftModal.selectedNfts,
      });

      const isSuccess = await signAndSendTransactionsInSeries({
        txnData: [
          { signers: pairTxn.signers, transaction: pairTxn.transaction },
          { signers: depositTxn.signers, transaction: depositTxn.transaction },
        ],
        connection,
        wallet,
      });

      if (isSuccess) {
        history.push('/my-pools');
      }
    }
    setIsCreatePoolButtonDisabled(false);
  };

  return (
    <AppLayout>
      <Title>Create pool</Title>
      <Steps current={step}>
        <Step title="Pick collection" />
        <Step title="Pick your side" />
        <Step title="Configuring trading" />
      </Steps>
      <Form
        layout="vertical"
        form={form}
        initialValues={initialValues}
        onValuesChange={onFormChange}
      >
        {step === 0 && (
          <div className={styles.stepsContent}>
            <div className={styles.stepContent}>
              {collectionsLoading ? (
                <Spinner />
              ) : (
                <Row>
                  <Col span={12} offset={6}>
                    <Form.Item name="market">
                      <Select
                        value={market}
                        style={{ width: '100%' }}
                        onChange={onSelectChange}
                      >
                        {markets?.map((market, index) => (
                          <Option key={index} value={market.marketPubkey}>
                            {market.collectionName ?? market.marketPubkey}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              )}
            </div>
            <div className={styles.stepsButtons}>
              {market && (
                <Button
                  className={styles.buttonNext}
                  onClick={onNextClick}
                >{`Next >`}</Button>
              )}
            </div>
          </div>
        )}
        {step === 1 && (
          <div className={styles.stepsContent}>
            <div className={styles.stepContent}>
              <div className={styles.radioWrapper}>
                <Form.Item name="side">
                  <Radio.Group value={side} onChange={onRadioChange}>
                    <Radio.Button value={PairType.TokenForNFT}>
                      Buy NFTs with tokens
                    </Radio.Button>
                    <Radio.Button value={PairType.NftForToken}>
                      Sell NFTs for tokens
                    </Radio.Button>
                    <Radio.Button value={PairType.LiquidityProvision}>
                      Do both and earn trading fees
                    </Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </div>
            </div>
            <div className={styles.stepsButtons}>
              <Button onClick={onBackClick}>{`< Back`}</Button>
              {side && <Button onClick={onNextClick}>{`Next >`}</Button>}
            </div>
          </div>
        )}
        {step === 2 && (
          <div className={styles.stepsContent}>
            <div className={styles.stepContent}>
              <Row>
                <Col span={11}>
                  <Card>
                    <Title level={3}>Pricing</Title>
                    {side === PairType.LiquidityProvision && (
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
                        Each time your pool {side}s an NFT, your {side} price
                        will adjust up by {delta} {unit}.
                      </Paragraph>
                    )}
                  </Card>
                </Col>
                <Col span={11} offset={2}>
                  {side === PairType.TokenForNFT && (
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
                  {side === PairType.NftForToken && (
                    <Card>
                      <Title level={3}>Assets</Title>
                      <div className={styles.nftsWrapper}>
                        {nftModal.selectedNfts?.map((nft) => (
                          <NFTCard
                            className={styles.nfts}
                            key={nft.mint}
                            imageUrl={nft.imageUrl}
                          />
                        ))}
                      </div>
                      <Button onClick={onSelectNftsClick}>+ Select NFTs</Button>
                    </Card>
                  )}
                  {side === PairType.LiquidityProvision && (
                    <Card>
                      <Title level={3}>Assets</Title>
                      <div className={styles.nftsWrapper}>
                        {nftModal.selectedNfts?.map((nft) => (
                          <NFTCard
                            className={styles.nfts}
                            key={nft.mint}
                            imageUrl={nft.imageUrl}
                          />
                        ))}
                      </div>
                      <Button onClick={onSelectNftsClick}>+ Select NFTs</Button>
                    </Card>
                  )}
                </Col>
              </Row>
            </div>
            <div className={styles.stepsButtons}>
              <Button onClick={onBackClick}>{`< Back`}</Button>
              <Button
                danger
                type="primary"
                onClick={onCreatePoolClick}
                disabled={
                  isCreatePoolButtonDisabled ||
                  (side !== PairType.TokenForNFT &&
                    !nftModal.selectedNfts.length)
                }
              >
                Create pool
              </Button>
            </div>
          </div>
        )}
      </Form>
      <SelectNftsModal {...nftModal} />
    </AppLayout>
  );
};
