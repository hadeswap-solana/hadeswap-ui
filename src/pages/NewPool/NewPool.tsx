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
import { hadeswap } from 'hadeswap-sdk';
import {
  BondingCurveType,
  OrderType,
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
import { signAndSendTransactionsInSeries } from '../../components/Layout/helpers';
import { createDepositNftsToPairTxns } from '../../utils/transactions/createDepositNftsToPairTxns';
import { createDepositLiquidityToPairTxns } from '../../utils/transactions/createDepositLiquidityToPairTxns';
import { createCreatePollLink } from '../../constants';
import { txsLoadingModalActions } from '../../state/txsLoadingModal/actions';
import { TxsLoadingModalTextStatus } from '../../state/txsLoadingModal/reducers';
import { notify } from '../../utils';
import { NotifyType } from '../../utils/solanaUtils';
import {
  createIxCardFuncs,
  IX_TYPE,
} from '../../components/TransactionsLoadingModal';

import styles from './NewPool.module.scss';

const { Step } = Steps;
const { Title, Paragraph } = Typography;
const { Option } = Select;

export const NewPool: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const connection = useConnection();
  const wallet = useWallet();
  const location = useLocation();
  const { publicKey: marketPubkeyParam, type: typeParam } = useParams<{
    publicKey: string;
    type: string;
  }>();
  const collectionsLoading = useSelector(selectAllMarketsLoading);
  const markets = useSelector(selectAllMarkets) as MarketInfo[];
  const [step, setStep] = useState<number>(
    marketPubkeyParam ? (typeParam ? 2 : 1) : 0,
  );
  const [form] = Form.useForm();
  const market = form.getFieldValue('market');
  const type = form.getFieldValue('type') ?? typeParam;
  const spotPrice = Form.useWatch('spotPrice', form);
  const curve = Form.useWatch('curve', form);
  const delta = Form.useWatch('delta', form);
  // const depositAmount = Form.useWatch('depositAmount', form);
  const nftAmount = Form.useWatch('nftAmount', form);
  const fee = Form.useWatch('fee', form);
  // const buyUpTo = Form.useWatch('buyUpTo', form);
  // const sellUpTo = Form.useWatch('sellUpTo', form);
  const chosenMarket = markets.find((item) => item.marketPubkey === market);
  const collectionName = chosenMarket?.collectionName ?? 'NFTs';
  const nftModal = useSelectNftsModal(
    collectionName,
    chosenMarket?.marketPubkey,
  );

  // buy createTokenForNftPairTxn
  // sell createPairTxn createDepositNftsToPairTxns
  // liquidity createPairTxn createDepositLiquidityToPairTxns
  const isCreateButtonDisabled =
    (type !== PairType.TokenForNFT && !nftModal.selectedNfts.length) ||
    (type === PairType.TokenForNFT && !nftAmount) ||
    !spotPrice;

  const initialValues = {
    market: market ?? marketPubkeyParam,
    type,
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
  // const deposit = (spotPrice - spotPrice * fee * 2) * buyUpTo;
  const rawSpotPrice = spotPrice * 1e9;
  const rawDelta =
    curve === BondingCurveType.Exponential ? delta * 100 : delta * 1e9;
  const rawFee = fee * 100;

  useEffect(() => {
    dispatch(coreActions.fetchAllMarkets());
  }, [dispatch]);

  useEffect(() => {
    if (market) {
      const url = type
        ? createCreatePollLink(market, type)
        : createCreatePollLink(market, '');

      if (url !== location.pathname) {
        history.push(url);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [market, type]);

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
    //console.log(form.getFieldsValue(['market', 'type', 'spotPrice', 'curve']));
  };

  const onCreatePoolClick = async () => {
    const transactions = [];
    const cards = [[createIxCardFuncs[IX_TYPE.CREATE_EMPTY_POOL]()]];

    if (type === PairType.TokenForNFT) {
      transactions.push(
        await createTokenForNftPairTxn({
          connection,
          wallet,
          marketPubkey: market,
          bondingCurveType: curve,
          pairType: PairType.TokenForNFT,
          delta: rawDelta,
          spotPrice: rawSpotPrice,
          amountOfOrders: nftAmount,
        }),
      );

      const amounts = hadeswap.helpers.calculatePricesArray({
        price: rawSpotPrice,
        delta: rawDelta,
        amount: nftAmount,
        bondingCurveType: curve,
        orderType: OrderType.Sell,
        counter: 0,
      });

      cards[0].push(
        createIxCardFuncs[IX_TYPE.ADD_OR_REMOVE_SOL_FROM_POOL](amounts.total),
      );
    } else {
      const pairTxn = await createPairTxn({
        connection,
        wallet,
        marketPubkey: market,
        bondingCurveType: curve,
        pairType:
          type === PairType.NftForToken
            ? PairType.NftForToken
            : PairType.LiquidityProvision,
        delta: rawDelta,
        spotPrice: rawSpotPrice,
        fee: rawFee,
      });

      transactions.push(pairTxn);

      if (type === PairType.NftForToken) {
        transactions.push(
          ...(await createDepositNftsToPairTxns({
            connection,
            wallet,
            pairPubkey: pairTxn.pairPubkey,
            authorityAdapter: pairTxn.authorityAdapterPubkey,
            nfts: nftModal.selectedNfts,
          })),
        );

        const nftCards = nftModal.selectedNfts.map((nft) =>
          createIxCardFuncs[IX_TYPE.ADD_OR_REMOVE_NFT_FROM_POOL](nft),
        );

        cards.push([nftCards]);
      } else if (type === PairType.LiquidityProvision) {
        transactions.push(
          ...(await createDepositLiquidityToPairTxns({
            connection,
            wallet,
            pairPubkey: pairTxn.pairPubkey,
            authorityAdapter: pairTxn.authorityAdapterPubkey,
            nfts: nftModal.selectedNfts,
          })),
        );

        const sellAmounts = hadeswap.helpers.calculatePricesArray({
          price: rawSpotPrice,
          delta: rawDelta,
          amount: nftModal.selectedNfts.length,
          bondingCurveType: curve,
          orderType: OrderType.Sell,
          counter: 0,
        });

        const nftCards = nftModal.selectedNfts.map((nft, index) =>
          createIxCardFuncs[IX_TYPE.ADD_OR_REMOVE_LIQUIDITY_FROM_POOL](
            nft,
            sellAmounts.array[index],
          ),
        );

        cards.push([nftCards]);
      }
    }

    const isSuccess = await signAndSendTransactionsInSeries({
      connection,
      wallet,
      txnData: transactions.map((txn, index) => ({
        signers: txn.signers,
        transaction: txn.transaction,
        onBeforeApprove: () => {
          dispatch(
            txsLoadingModalActions.setState({
              visible: true,
              cards: cards[index],
              amountOfTxs: transactions.length,
              currentTxNumber: 1 + index,
              textStatus: TxsLoadingModalTextStatus.APPROVE,
            }),
          );
        },
        onAfterSend: () => {
          dispatch(
            txsLoadingModalActions.setTextStatus(
              TxsLoadingModalTextStatus.WAITING,
            ),
          );
        },
        onError: () => {
          notify({
            message: 'Transaction just failed for some reason',
            type: NotifyType.ERROR,
          });
        },
      })),
    });

    dispatch(txsLoadingModalActions.setVisible(false));

    if (isSuccess) {
      history.push('/my-pools');
    }
  };

  return (
    <AppLayout>
      <Title>Create pool</Title>
      {!wallet.connected && (
        <Typography.Title level={3}>
          Connect your wallet for pool creation
        </Typography.Title>
      )}
      {wallet.connected && (
        <>
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
                            showSearch
                            value={market}
                            optionFilterProp="children"
                            style={{ width: '100%' }}
                            onChange={onSelectChange}
                            filterOption={(input, option) =>
                              (option!.children as unknown as string)
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
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
                    <Form.Item name="type">
                      <Radio.Group value={type} onChange={onRadioChange}>
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
                  {type && <Button onClick={onNextClick}>{`Next >`}</Button>}
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
                          label="Spot price"
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
                            You have selected a starting price of {spotPrice}{' '}
                            SOL.
                          </Paragraph>
                        )}
                        {Boolean(delta) && (
                          <Paragraph>
                            Each time your pool {type}s an NFT, your {type}{' '}
                            price will adjust up by {delta} {unit}.
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
                            {nftModal.selectedNfts?.map((nft) => (
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
                            {nftModal.selectedNfts?.map((nft) => (
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
                  <Button onClick={onBackClick}>{`< Back`}</Button>
                  <Button
                    danger
                    type="primary"
                    onClick={onCreatePoolClick}
                    disabled={isCreateButtonDisabled}
                  >
                    Create pool
                  </Button>
                </div>
              </div>
            )}
          </Form>
          <SelectNftsModal {...nftModal} />
        </>
      )}
    </AppLayout>
  );
};
