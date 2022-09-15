import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { differenceBy } from 'lodash';
import {
  Button,
  Card,
  Col,
  Form,
  InputNumber,
  Radio,
  Row,
  Typography,
} from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useWallet } from '@solana/wallet-adapter-react';
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
import { createWithdrawSolFromPairTxn } from '../../utils/transactions/createWithdrawSolFromPairTxn';
import { signAndSendTransactionsInSeries } from '../../components/Layout/helpers';
import { txsLoadingModalActions } from '../../state/txsLoadingModal/actions';
import { TxsLoadingModalTextStatus } from '../../state/txsLoadingModal/reducers';
import { notify } from '../../utils';
import { NotifyType } from '../../utils/solanaUtils';
import { createModifyPairTxn } from '../../utils/transactions/createModifyPairTxn';
import { createWithdrawNftsFromPairTxns } from '../../utils/transactions/createWithdrawNftsFromPairTxns';
import { createDepositNftsToPairTxns } from '../../utils/transactions/createDepositNftsToPairTxns';
import { createDepositLiquidityToPairTxns } from '../../utils/transactions/createDepositLiquidityToPairTxns';
import { createWithdrawLiquidityFromPairTxns } from '../../utils/transactions/createWithdrawLiquidityFromPairTxns';
import { createDepositSolToPairTxn } from '../../utils/transactions/createDepositSolToPairTxn';
import {
  createIxCardFuncs,
  IX_TYPE,
} from '../../components/TransactionsLoadingModal';

import styles from './EditPool.module.scss';
import { hadeswap } from 'hadeswap-sdk';

const { Title, Paragraph } = Typography;

export const EditPool: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const connection = useConnection();
  const wallet = useWallet();
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
    pool?.sellOrders,
  );

  const walletNfts = pool?.sellOrders
    ? [...pool?.sellOrders, ...nftModal.walletNfts]
    : nftModal.walletNfts;
  const type = pool?.type;

  const initialValues = {
    curve: pool?.bondingCurve,
    fee: pool?.fee / 100,
    spotPrice: pool?.currentSpotPrice / 1e9,
    delta:
      pool?.bondingCurve === BondingCurveType.Exponential
        ? pool?.delta / 100
        : pool?.delta / 1e9,
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

  const isPricingChanged =
    pool?.currentSpotPrice !== rawSpotPrice ||
    pool?.delta !== rawDelta ||
    (type === PairType.LiquidityProvision && pool?.fee !== rawFee);
  const isNftAmountChanged = pool?.buyOrdersAmount !== nftAmount;
  const isSaveButtonDisabled =
    !(isPricingChanged || isNftAmountChanged) || !spotPrice;

  const nftsToDelete = differenceBy(
    pool?.sellOrders,
    nftModal.selectedNfts,
    'mint',
  );
  const nftsToAdd = nftModal.selectedNfts.filter((nft) => !nft.nftPairBox);

  useEffect(() => {
    dispatch(coreActions.fetchAllMarkets());
    dispatch(coreActions.fetchPair(poolPubKey));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const onSelectNftsClick = () => {
    nftModal.setVisible(true);
  };

  const onFormChange = () => {
    //console.log(form.getFieldsValue(['market', 'type', 'spotPrice', 'curve']));
  };

  const onSavePoolClick = async () => {
    const transactions = [];
    const cards = [];

    if (isPricingChanged) {
      transactions.push(
        await createModifyPairTxn({
          connection,
          wallet,
          pairPubkey: pool.pairPubkey,
          authorityAdapter: pool.authorityAdapterPubkey,
          delta: rawDelta,
          spotPrice: rawSpotPrice,
          fee: rawFee,
        }),
      );

      cards.push([createIxCardFuncs[IX_TYPE.EDIT_POOL]()]);
    }

    if (type === PairType.TokenForNFT) {
      if (isNftAmountChanged) {
        if (pool?.buyOrdersAmount < nftAmount) {
          transactions.push(
            await createDepositSolToPairTxn({
              connection,
              wallet,
              pairPubkey: pool.pairPubkey,
              authorityAdapter: pool.authorityAdapterPubkey,
              amountOfOrders: nftAmount - pool?.buyOrdersAmount,
            }),
          );

          const sellAmounts = hadeswap.helpers.calculatePricesArray({
            price: rawSpotPrice,
            delta: rawDelta,
            amount: nftAmount,
            bondingCurveType: curve,
            orderType: OrderType.Sell,
            counter: pool?.mathCounter,
          });
          const amount = sellAmounts.total - pool.fundsSolOrTokenBalance;

          cards.push([
            createIxCardFuncs[IX_TYPE.ADD_OR_REMOVE_SOL_FROM_POOL](amount),
          ]);
        } else {
          transactions.push(
            await createWithdrawSolFromPairTxn({
              connection,
              wallet,
              pairPubkey: pool.pairPubkey,
              authorityAdapter: pool.authorityAdapterPubkey,
              amountOfOrders: pool?.buyOrdersAmount - nftAmount,
            }),
          );

          const buyAmounts = hadeswap.helpers.calculatePricesArray({
            price: rawSpotPrice,
            delta: rawDelta,
            amount: nftAmount,
            bondingCurveType: curve,
            orderType: OrderType.Buy,
            counter: pool?.mathCounter,
          });
          const amount = nftAmount
            ? pool.fundsSolOrTokenBalance - buyAmounts.total
            : pool.fundsSolOrTokenBalance;

          cards.push([
            createIxCardFuncs[IX_TYPE.ADD_OR_REMOVE_SOL_FROM_POOL](
              amount,
              true,
            ),
          ]);
        }
      }
    } else if (type === PairType.NftForToken) {
      transactions.push(
        ...(await createDepositNftsToPairTxns({
          connection,
          wallet,
          pairPubkey: pool.pairPubkey,
          authorityAdapter: pool.authorityAdapterPubkey,
          nfts: nftsToAdd,
        })),
      );

      transactions.push(
        ...(await createWithdrawNftsFromPairTxns({
          connection,
          wallet,
          pairPubkey: pool.pairPubkey,
          authorityAdapter: pool.authorityAdapterPubkey,
          nfts: nftsToDelete,
        })),
      );

      const nftAddCards = nftsToAdd.map((nft) =>
        createIxCardFuncs[IX_TYPE.ADD_OR_REMOVE_NFT_FROM_POOL](nft),
      );

      const nftRemoveCards = nftsToDelete.map((nft) =>
        createIxCardFuncs[IX_TYPE.ADD_OR_REMOVE_NFT_FROM_POOL](nft, true),
      );

      cards.push([nftAddCards], [nftRemoveCards]);
    } else if (type === PairType.LiquidityProvision) {
      transactions.push(
        ...(await createDepositLiquidityToPairTxns({
          connection,
          wallet,
          pairPubkey: pool.pairPubkey,
          authorityAdapter: pool.authorityAdapterPubkey,
          nfts: nftsToAdd,
        })),
      );

      transactions.push(
        ...(await createWithdrawLiquidityFromPairTxns({
          connection,
          wallet,
          pairPubkey: pool.pairPubkey,
          authorityAdapter: pool.authorityAdapterPubkey,
          nfts: nftsToDelete,
        })),
      );

      const sellAmounts = hadeswap.helpers.calculatePricesArray({
        price: rawSpotPrice,
        delta: rawDelta,
        amount: nftModal.selectedNfts.length,
        bondingCurveType: curve,
        orderType: OrderType.Sell,
        counter: pool?.mathCounter,
      });
      sellAmounts.array.reverse();

      const nftAddCards = nftsToAdd.map((nft, index) =>
        createIxCardFuncs[IX_TYPE.ADD_OR_REMOVE_LIQUIDITY_FROM_POOL](
          nft,
          sellAmounts.array[index],
        ),
      );

      const nftRemoveCards = nftsToDelete.map((nft, index) =>
        createIxCardFuncs[IX_TYPE.ADD_OR_REMOVE_LIQUIDITY_FROM_POOL](
          nft,
          sellAmounts.array[index],
          true,
        ),
      );

      cards.push([nftAddCards], [nftRemoveCards]);
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
      history.push(`/pools/${pool?.pairPubkey}`);
    }
  };

  return (
    <AppLayout>
      <Title>Edit pool</Title>
      {!wallet.connected && (
        <Typography.Title level={3}>
          Connect your wallet to edit pool
        </Typography.Title>
      )}
      {wallet.connected &&
        (loading || !pool ? (
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
                          <Radio.Group
                            disabled
                            className={styles.input}
                            value={curve}
                          >
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
                              min={0}
                              addonAfter="NFTs"
                            />
                          </Form.Item>
                        </Card>
                      )}
                      {type === PairType.NftForToken && (
                        <Card>
                          <Title level={3}>Assets</Title>
                          <div className={styles.nftsWrapper}>
                            {nftModal.selectedNfts.map((nft) => (
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
                            {nftModal.selectedNfts.map((nft) => (
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
                    disabled={isSaveButtonDisabled}
                  >
                    Save changes
                  </Button>
                </div>
              </div>
            </Form>
            <SelectNftsModal {...nftModal} walletNfts={walletNfts} />
          </>
        ))}
    </AppLayout>
  );
};
