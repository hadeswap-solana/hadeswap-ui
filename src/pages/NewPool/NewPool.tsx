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
import {
  selectAllMarkets,
  selectAllMarketsLoading,
} from '../../state/core/selectors';
import { notify } from '../../utils';
import { NotifyType } from '../../utils/solanaUtils';
import { getArrayByNumber } from '../../utils/transactions';
import {
  createIxCardFuncs,
  IX_TYPE,
} from '../../components/TransactionsLoadingModal';
import { helpers } from 'hadeswap-sdk/lib/hadeswap-core';

import { chunk } from 'lodash';
import { createDepositSolToPairTxn } from '../../utils/transactions/createDepositSolToPairTxn';
import styles from './NewPool.module.scss';
import { useFetchAllMarkets } from '../../requests';

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

  const [step, setStep] = useState<number>(
    marketPubkeyParam ? (typeParam ? 2 : 1) : 0,
  );
  const [form] = Form.useForm();
  const market = form.getFieldValue('market');
  const type = form.getFieldValue('type') ?? typeParam;
  const spotPrice = Form.useWatch('spotPrice', form);
  const curve = Form.useWatch('curve', form);
  const delta = Form.useWatch('delta', form);
  const nftAmount = Form.useWatch('nftAmount', form);
  const fee = Form.useWatch('fee', form);

  useFetchAllMarkets();

  const markets = useSelector(selectAllMarkets);
  const isLoading = useSelector(selectAllMarketsLoading);

  const chosenMarket = markets.find((item) => item.marketPubkey === market);
  const collectionName = chosenMarket?.collectionName ?? 'nfts';

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

  const rawSpotPrice = spotPrice * 1e9;
  const rawDelta =
    curve === BondingCurveType.Exponential ? delta * 100 : delta * 1e9;
  const rawFee = fee * 100;

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

  const onSelectChange = useCallback(() => {
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

  const onCreatePoolClick = async () => {
    const transactions = [];
    const cards = [[createIxCardFuncs[IX_TYPE.CREATE_EMPTY_POOL]()]];

    if (type === PairType.TokenForNFT) {
      const nftAmounts = getArrayByNumber(nftAmount, 20);
      const firstAmount = nftAmounts.shift();

      const createTransaction = await createTokenForNftPairTxn({
        connection,
        wallet,
        marketPubkey: market,
        bondingCurveType: curve,
        pairType: PairType.TokenForNFT,
        delta: rawDelta,
        spotPrice: rawSpotPrice,
        amountOfOrders: firstAmount,
      });

      transactions.push(createTransaction);

      for (const amount of nftAmounts) {
        transactions.push(
          await createDepositSolToPairTxn({
            connection,
            wallet,
            pairPubkey: createTransaction.pairPubkey.toBase58(),
            authorityAdapter:
              createTransaction.authorityAdapterPubkey.toBase58(),
            amountOfOrders: amount,
          }),
        );
      }

      const amounts = hadeswap.helpers.calculatePricesArray({
        starting_spot_price: rawSpotPrice,
        delta: rawDelta,
        amount: nftAmount,
        bondingCurveType: curve,
        orderType: OrderType.Sell,
        counter: 1,
      });

      cards[0].push(
        createIxCardFuncs[IX_TYPE.ADD_OR_REMOVE_SOL_FROM_POOL](amounts.total),
      );

      //TODO: FIX
      for (let i = 0; i < transactions.length - 1; i++) {
        cards.push([createIxCardFuncs[IX_TYPE.EDIT_POOL]()]);
      }
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
        const txns = await createDepositNftsToPairTxns({
          connection,
          wallet,
          pairPubkey: pairTxn.pairPubkey,
          authorityAdapter: pairTxn.authorityAdapterPubkey,
          nfts: nftModal.selectedNfts,
        });

        const nftCards = nftModal.selectedNfts.map((nft) =>
          createIxCardFuncs[IX_TYPE.ADD_OR_REMOVE_NFT_FROM_POOL](nft),
        );

        transactions.push(...txns);
        cards.push(
          ...chunk(nftCards, Math.round(nftCards.length / txns.length)),
        );
      } else if (type === PairType.LiquidityProvision) {
        const txns = await createDepositLiquidityToPairTxns({
          connection,
          wallet,
          pairPubkey: pairTxn.pairPubkey,
          authorityAdapter: pairTxn.authorityAdapterPubkey,
          nfts: nftModal.selectedNfts,
        });

        const sellAmounts = hadeswap.helpers.calculatePricesArray({
          starting_spot_price: rawSpotPrice,
          delta: rawDelta,
          amount: nftModal.selectedNfts.length,
          bondingCurveType: curve,
          orderType: OrderType.Sell,
          counter: 1,
        });

        const nftCards = nftModal.selectedNfts.map((nft, index) =>
          createIxCardFuncs[IX_TYPE.ADD_OR_REMOVE_LIQUIDITY_FROM_POOL](
            nft,
            sellAmounts.array[index],
          ),
        );

        transactions.push(...txns);
        cards.push(
          ...chunk(nftCards, Math.round(nftCards.length / txns.length)),
        );
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
      <Title>create pool</Title>
      {!wallet.connected && (
        <Typography.Title level={3}>
          connect your wallet for pool creation
        </Typography.Title>
      )}
      {wallet.connected && (
        <>
          <Steps current={step}>
            <Step title="select collection" />
            <Step title="select pool type" />
            <Step title="pool settings" />
          </Steps>
          <Form layout="vertical" form={form} initialValues={initialValues}>
            {step === 0 && (
              <div className={styles.stepsContent}>
                <div className={styles.stepContent}>
                  {isLoading ? (
                    <Spinner />
                  ) : (
                    <Row>
                      <Col span={12} offset={6}>
                        <Form.Item name="market">
                          <Select
                            showSearch
                            value={market}
                            placeholder="select collection"
                            optionFilterProp="children"
                            style={{ width: '100%' }}
                            onChange={onSelectChange}
                            filterOption={(input, option) =>
                              (option?.children as unknown as string)
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
                    >{`next >`}</Button>
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
                          buy NFTs with tokens
                        </Radio.Button>
                        <Radio.Button value={PairType.NftForToken}>
                          sell NFTs with tokens
                        </Radio.Button>
                        <Radio.Button value={PairType.LiquidityProvision}>
                          do both and earn trading fees
                        </Radio.Button>
                      </Radio.Group>
                    </Form.Item>
                  </div>
                </div>
                <div className={styles.stepsButtons}>
                  <Button onClick={onBackClick}>{`< back`}</Button>
                  {type && <Button onClick={onNextClick}>{`next >`}</Button>}
                </div>
              </div>
            )}
            {step === 2 && (
              <div className={styles.stepsContent}>
                <div className={styles.stepContent}>
                  <Row>
                    <Col span={24} md={11} className={styles.pricingBlock}>
                      <Card bordered={false}>
                        <Title level={3}>pricing</Title>
                        {type === PairType.LiquidityProvision && (
                          <Form.Item
                            name="fee"
                            label="fee"
                            tooltip={{
                              title: '',
                              icon: <InfoCircleOutlined />,
                            }}
                          >
                            <InputNumber
                              className={styles.input}
                              min={0}
                              max={99.5}
                              addonAfter="%"
                            />
                          </Form.Item>
                        )}
                        <Form.Item
                          name="spotPrice"
                          label={`spot price ${
                            chosenMarket
                              ? `(current best offer: ${chosenMarket?.bestoffer} SOL, current floor price: ${chosenMarket?.floorPrice} SOL)`
                              : ''
                          }`}
                          tooltip={{
                            title: '',
                            icon: <InfoCircleOutlined />,
                          }}
                        >
                          <InputNumber
                            className={styles.input}
                            // defaultValue={type === PairType.NftForToken || type === PairType.LiquidityProvision ? (chosenMarket?.bestoffer === '0.000' ? 0 : chosenMarket?.bestoffer) : 0}
                            min={
                              type === PairType.NftForToken ||
                              type === PairType.LiquidityProvision
                                ? chosenMarket?.bestoffer === '0.000'
                                  ? 0
                                  : chosenMarket?.bestoffer
                                : 0
                            }
                            max={
                              type === PairType.TokenForNFT ||
                              type === PairType.LiquidityProvision
                                ? chosenMarket?.floorPrice === '0.000'
                                  ? 100000000
                                  : chosenMarket?.floorPrice
                                : 100000000
                            }
                            addonAfter="SOL"
                          />
                        </Form.Item>
                        <Form.Item
                          name="curve"
                          label="bonding curve"
                          tooltip={{
                            title: '',
                            icon: <InfoCircleOutlined />,
                          }}
                        >
                          <Radio.Group className={styles.input} value={curve}>
                            <Radio.Button value={BondingCurveType.Linear}>
                              linear curve
                            </Radio.Button>
                            <Radio.Button value={BondingCurveType.Exponential}>
                              exponential curve
                            </Radio.Button>
                          </Radio.Group>
                        </Form.Item>
                        <Form.Item
                          name="delta"
                          label="delta"
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
                        {/* {Boolean(spotPrice) && (
                          <Paragraph>
                            you have selected a starting price of {spotPrice}{' '}
                            SOL.
                          </Paragraph>
                        )} */}
                        {Boolean(
                          type === PairType.TokenForNFT ||
                            type === PairType.LiquidityProvision,
                        ) && (
                          <Paragraph>
                            starting buying price {spotPrice} SOL.
                          </Paragraph>
                        )}
                        {Boolean(
                          type === PairType.NftForToken ||
                            type === PairType.LiquidityProvision,
                        ) && (
                          <Paragraph>
                            starting selling price{' '}
                            {helpers.calculateNextSpotPrice({
                              orderType: OrderType.Buy,
                              delta: delta,
                              spotPrice: spotPrice,
                              bondingCurveType: curve,
                              counter: 0,
                            })}{' '}
                            SOL.
                          </Paragraph>
                        )}

                        {/*Boolean(delta) && (
                          <Paragraph>
                            Each time your pool {PoolType[type]} an NFT, your {PoolType[type]}{' '}
                            price will adjust up by {delta} {unit}.
                          </Paragraph>
                        )*/}
                      </Card>
                    </Col>
                    <Col span={24} md={{ offset: 2, span: 11 }}>
                      {type === PairType.TokenForNFT && (
                        <Card bordered={false}>
                          <Title level={3}>assets</Title>
                          <Form.Item label="amount of NFTs" name="nftAmount">
                            <InputNumber
                              className={styles.input}
                              min="0"
                              addonAfter="NFTs"
                            />
                          </Form.Item>
                        </Card>
                      )}
                      {type === PairType.NftForToken && (
                        <Card bordered={false}>
                          <Title level={3}>assets</Title>
                          <div className={styles.nftsWrapper}>
                            {nftModal.selectedNfts?.map((nft) => (
                              <NFTCard
                                key={nft.mint}
                                imageUrl={nft.imageUrl}
                                simpleCard
                              />
                            ))}
                          </div>
                          <Button onClick={onSelectNftsClick}>
                            + select NFTs
                          </Button>
                        </Card>
                      )}
                      {type === PairType.LiquidityProvision && (
                        <Card bordered={false}>
                          <Title level={3}>assets</Title>
                          <div className={styles.nftsWrapper}>
                            {nftModal.selectedNfts?.map((nft) => (
                              <NFTCard
                                key={nft.mint}
                                imageUrl={nft.imageUrl}
                                simpleCard
                              />
                            ))}
                          </div>
                          <Button onClick={onSelectNftsClick}>
                            + select NFTs
                          </Button>
                        </Card>
                      )}
                    </Col>
                  </Row>
                </div>
                <div className={styles.stepsButtons}>
                  <Button onClick={onBackClick}>{`< back`}</Button>
                  <Button
                    type="primary"
                    onClick={onCreatePoolClick}
                    disabled={isCreateButtonDisabled}
                  >
                    create pool
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
