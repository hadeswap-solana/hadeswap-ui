import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { chunk, differenceBy } from 'lodash';
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
import { getArrayByNumber } from '../../utils/transactions';
import { createModifyPairTxn } from '../../utils/transactions/createModifyPairTxn';
import { createWithdrawNftsFromPairTxns } from '../../utils/transactions/createWithdrawNftsFromPairTxns';
import { createDepositNftsToPairTxns } from '../../utils/transactions/createDepositNftsToPairTxns';
import { createDepositLiquidityToPairTxns } from '../../utils/transactions/createDepositLiquidityToPairTxns';
import { createWithdrawLiquidityFromPairTxns } from '../../utils/transactions/createWithdrawLiquidityFromPairTxns';
import { createDepositSolToPairTxn } from '../../utils/transactions/createDepositSolToPairTxn';
import { createWithdrawLiquidityFromBuyOrdersPair } from '../../utils/transactions/createWithdrawLiquidityFromBuyOrdersPairTxn';
import {
  createIxCardFuncs,
  IX_TYPE,
} from '../../components/TransactionsLoadingModal';

import styles from './EditPool.module.scss';
import { hadeswap } from 'hadeswap-sdk';
import { createWithdrawLiquidityFromSellOrdersPair } from '../../utils/transactions/createWithdrawLiquidityFromSellOrdersPairTxn';

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
  const buyOrdersAmount = Form.useWatch('buyOrdersAmount', form);
  const fee = Form.useWatch('fee', form);
  const chosenMarket = markets.find(
    (item) => item.marketPubkey === pool?.market,
  );
  const collectionName = chosenMarket?.collectionName ?? 'nfts';
  const nftModal = useSelectNftsModal(
    collectionName,
    chosenMarket?.marketPubkey,
    pool?.sellOrders,
  );

  const type = pool?.type;
  const isLiquidityProvisionPool = type === PairType.LiquidityProvision;
  const isNftForTokenPool = type === PairType.NftForToken;
  const isTokenForNFTPool = type === PairType.TokenForNFT;

  const initialValues = {
    curve: pool?.bondingCurve,
    fee: pool?.fee / 100,
    spotPrice: pool?.currentSpotPrice / 1e9,
    delta:
      pool?.bondingCurve === BondingCurveType.Exponential
        ? pool?.delta / 100
        : pool?.delta / 1e9,
    nftAmount: pool?.buyOrdersAmount,
    buyOrdersAmount: pool?.buyOrdersAmount,
    depositAmount: 0,
  };

  const loading = poolLoading || marketLoading;
  const unit = curve === BondingCurveType.Exponential ? '%' : 'SOL';
  const rawSpotPrice = spotPrice * 1e9;
  const rawDelta =
    curve === BondingCurveType.Exponential ? delta * 100 : delta * 1e9;
  const rawFee = fee * 100;

  const nftsToDelete = differenceBy(
    pool?.sellOrders,
    nftModal.selectedNfts,
    'mint',
  );
  const nftsToAdd = nftModal.selectedNfts.filter((nft) => !nft.nftPairBox);

  let walletNfts = pool?.sellOrders
    ? [...pool?.sellOrders, ...nftModal.walletNfts]
    : nftModal.walletNfts;

  if (isLiquidityProvisionPool) {
    walletNfts = walletNfts.map((nft) => {
      const order = pool?.sellOrders.find((order) => order.mint === nft.mint);
      nft.disabled = false;

      if (nftsToAdd.length) {
        nft.disabled = Boolean(order);
      }

      if (nftsToDelete.length) {
        nft.disabled = !order;
      }

      return nft;
    });
  }

  const isPricingChanged =
    pool?.currentSpotPrice !== rawSpotPrice ||
    pool?.delta !== rawDelta ||
    (isLiquidityProvisionPool && pool?.fee !== rawFee);

  const isTokenForNftChanged =
    pool?.buyOrdersAmount !== (nftAmount ?? pool?.buyOrdersAmount);
  const isNftForTokenChanged = nftsToDelete.length || nftsToAdd.length;
  const isLiquidityProvisionChanged = pool?.buyOrdersAmount !== buyOrdersAmount;

  const isChanged = isLiquidityProvisionPool
    ? isLiquidityProvisionChanged
    : isTokenForNftChanged;

  const isSaveButtonDisabled =
    !(isPricingChanged || isNftForTokenChanged || isChanged) || !spotPrice;
  const isSelectedButtonDisabled = buyOrdersAmount < pool?.buyOrdersAmount;

  const isDisableFields = isTokenForNFTPool && pool?.buyOrdersAmount > 20;

  useEffect(() => {
    dispatch(coreActions.fetchAllMarkets());
    dispatch(coreActions.fetchPair(poolPubKey));
  }, [dispatch]);

  useEffect(() => {
    form.setFieldsValue({
      buyOrdersAmount: initialValues.buyOrdersAmount + nftsToAdd.length,
    });
  }, [nftModal.selectedNfts.length]);

  useEffect(() => {
    //TODO: Why we need this?
    form.setFieldsValue({ buyOrdersAmount: pool?.buyOrdersAmount });
  }, [pool?.buyOrdersAmount]);

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
      const startingSpotPrice = hadeswap.helpers.calculateNextSpotPrice({
        orderType: OrderType.Buy,
        delta: rawDelta,
        bondingCurveType: pool?.bondingCurve as BondingCurveType,
        spotPrice: rawSpotPrice,
        counter: -pool?.mathCounter - 1,
      });

      transactions.push(
        await createModifyPairTxn({
          connection,
          wallet,
          pairPubkey: pool.pairPubkey,
          authorityAdapter: pool.authorityAdapterPubkey,
          delta: rawDelta,
          spotPrice: startingSpotPrice,
          fee: rawFee,
        }),
      );

      cards.push([createIxCardFuncs[IX_TYPE.EDIT_POOL]()]);
    }

    if (isTokenForNFTPool) {
      if (isTokenForNftChanged) {
        if (pool?.buyOrdersAmount < nftAmount) {
          const amountOfOrders = getArrayByNumber(
            nftAmount - pool?.buyOrdersAmount,
            20,
          );

          for (const amount of amountOfOrders) {
            transactions.push(
              await createDepositSolToPairTxn({
                connection,
                wallet,
                pairPubkey: pool.pairPubkey,
                authorityAdapter: pool.authorityAdapterPubkey,
                amountOfOrders: amount,
              }),
            );
          }

          const sellAmounts = hadeswap.helpers.calculatePricesArray({
            starting_spot_price: rawSpotPrice,
            delta: rawDelta,
            amount: nftAmount - pool?.buyOrdersAmount,
            bondingCurveType: curve,
            orderType: OrderType.Sell,
            counter: pool?.buyOrdersAmount * -1 + 1,
          });

          cards.push([
            createIxCardFuncs[IX_TYPE.ADD_OR_REMOVE_SOL_FROM_POOL](
              sellAmounts.total,
            ),
          ]);

          //TODO: FIX
          for (let i = 0; i < transactions.length - 1; i++) {
            cards.push([createIxCardFuncs[IX_TYPE.EDIT_POOL]()]);
          }
        } else {
          const amountOfOrders = getArrayByNumber(
            pool?.buyOrdersAmount - nftAmount,
            20,
          );

          for (const amount of amountOfOrders) {
            transactions.push(
              await createWithdrawSolFromPairTxn({
                connection,
                wallet,
                pairPubkey: pool.pairPubkey,
                authorityAdapter: pool.authorityAdapterPubkey,
                amountOfOrders: amount,
              }),
            );
          }

          const buyAmounts = hadeswap.helpers.calculatePricesArray({
            starting_spot_price: rawSpotPrice,
            delta: rawDelta,
            amount: pool?.buyOrdersAmount - nftAmount,
            bondingCurveType: curve,
            orderType: OrderType.Buy,
            counter: pool?.buyOrdersAmount * -1,
          });

          cards.push([
            createIxCardFuncs[IX_TYPE.ADD_OR_REMOVE_SOL_FROM_POOL](
              buyAmounts.total,
              true,
            ),
          ]);

          //TODO: FIX
          for (let i = 0; i < transactions.length - 1; i++) {
            cards.push([createIxCardFuncs[IX_TYPE.EDIT_POOL]()]);
          }
        }
      }
    } else if (isNftForTokenPool) {
      const addTxns = await createDepositNftsToPairTxns({
        connection,
        wallet,
        pairPubkey: pool.pairPubkey,
        authorityAdapter: pool.authorityAdapterPubkey,
        nfts: nftsToAdd,
      });

      const deleteTxns = await createWithdrawNftsFromPairTxns({
        connection,
        wallet,
        pairPubkey: pool.pairPubkey,
        authorityAdapter: pool.authorityAdapterPubkey,
        nfts: nftsToDelete,
      });

      const nftAddCards = nftsToAdd.map((nft) =>
        createIxCardFuncs[IX_TYPE.ADD_OR_REMOVE_NFT_FROM_POOL](nft),
      );

      const nftRemoveCards = nftsToDelete.map((nft) =>
        createIxCardFuncs[IX_TYPE.ADD_OR_REMOVE_NFT_FROM_POOL](nft, true),
      );

      transactions.push(...addTxns);
      transactions.push(...deleteTxns);
      cards.push(
        ...chunk(nftAddCards, Math.round(nftAddCards.length / addTxns.length)),
      );
      cards.push(
        ...chunk(
          nftRemoveCards,
          Math.round(nftRemoveCards.length / deleteTxns.length),
        ),
      );
    } else if (isLiquidityProvisionPool) {
      const txns = await createDepositLiquidityToPairTxns({
        connection,
        wallet,
        pairPubkey: pool.pairPubkey,
        authorityAdapter: pool.authorityAdapterPubkey,
        nfts: nftsToAdd,
      });

      const sellAmounts = hadeswap.helpers.calculatePricesArray({
        starting_spot_price: rawSpotPrice,
        delta: rawDelta,
        amount: nftsToAdd.length,
        bondingCurveType: curve,
        orderType: OrderType.Sell,
        counter: ((pool?.nftsCount + pool?.buyOrdersAmount) / 2) * -1,
      });

      const nftAddCards = nftsToAdd.map((nft, index) =>
        createIxCardFuncs[IX_TYPE.ADD_OR_REMOVE_LIQUIDITY_FROM_POOL](
          nft,
          sellAmounts.array[index],
        ),
      );

      transactions.push(...txns);
      cards.push(
        ...chunk(nftAddCards, Math.round(nftAddCards.length / txns.length)),
      );

      if (pool.liquidityProvisionOrders.length) {
        const buyAmounts = hadeswap.helpers.calculatePricesArray({
          starting_spot_price: rawSpotPrice,
          delta: rawDelta,
          amount: nftsToDelete.length,
          bondingCurveType: curve,
          orderType: OrderType.Buy,
          counter: ((pool?.nftsCount + pool?.buyOrdersAmount) / 2) * -1 - 1,
        });

        if (pool?.nftsCount > 0 && pool?.buyOrdersAmount > 0) {
          const txns = await createWithdrawLiquidityFromPairTxns({
            connection,
            wallet,
            pairPubkey: pool.pairPubkey,
            liquidityProvisionOrders: pool.liquidityProvisionOrders,
            authorityAdapter: pool.authorityAdapterPubkey,
            nfts: nftsToDelete,
          });

          const nftRemoveCards = nftsToDelete.map((nft, index) =>
            createIxCardFuncs[IX_TYPE.ADD_OR_REMOVE_LIQUIDITY_FROM_POOL](
              nft,
              buyAmounts.array[index],
              true,
            ),
          );

          transactions.push(...txns);
          cards.push(
            ...chunk(
              nftRemoveCards,
              Math.round(nftRemoveCards.length / txns.length),
            ),
          );
        } else if (pool?.nftsCount === 0 && pool?.buyOrdersAmount > 0) {
          if (isLiquidityProvisionChanged) {
            const ordersToDelete =
              pool.buyOrdersAmount - buyOrdersAmount || pool.buyOrdersAmount;

            transactions.push(
              ...(await createWithdrawLiquidityFromBuyOrdersPair({
                connection,
                wallet,
                pairPubkey: pool.pairPubkey,
                liquidityProvisionOrders: pool.liquidityProvisionOrders,
                authorityAdapter: pool.authorityAdapterPubkey,
                buyOrdersAmountToDelete: ordersToDelete,
              })),
            );

            cards.push([
              createIxCardFuncs[IX_TYPE.REMOVE_BUY_ORDERS_FROM_POOL](
                ordersToDelete,
              ),
            ]);
          }
        } else if (pool?.nftsCount > 0 && pool?.buyOrdersAmount === 0) {
          const txns = await createWithdrawLiquidityFromSellOrdersPair({
            connection,
            wallet,
            pairPubkey: pool.pairPubkey,
            liquidityProvisionOrders: pool.liquidityProvisionOrders,
            authorityAdapter: pool.authorityAdapterPubkey,
            nfts: nftsToDelete,
          });

          const nftRemoveCards = nftsToDelete.map((nft, index) =>
            createIxCardFuncs[IX_TYPE.ADD_OR_REMOVE_LIQUIDITY_FROM_POOL](
              nft,
              buyAmounts.array[index],
              true,
            ),
          );

          transactions.push(...txns);
          cards.push(
            ...chunk(
              nftRemoveCards,
              Math.round(nftRemoveCards.length / txns.length),
            ),
          );
        }
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
                      <Card bordered={false}>
                        {isDisableFields && (
                          <Paragraph>
                            {
                              'you can edit "spot price" and "delta" only if you have less than 20 buy orders.'
                            }
                          </Paragraph>
                        )}
                        <Title level={3}>pricing</Title>
                        {isLiquidityProvisionPool && (
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
                              min="0"
                              addonAfter="%"
                            />
                          </Form.Item>
                        )}
                        <Form.Item
                          name="spotPrice"
                          label="spot price"
                          tooltip={{
                            title: '',
                            icon: <InfoCircleOutlined />,
                          }}
                        >
                          <InputNumber
                            disabled={isDisableFields}
                            className={styles.input}
                            min="0"
                            addonAfter="SOL"
                          />
                        </Form.Item>
                        <Form.Item
                          name="curve"
                          label="bonding Curve"
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
                            disabled={isDisableFields}
                            min="0"
                          />
                        </Form.Item>
                        {Boolean(spotPrice) && (
                          <Paragraph>
                            you have selected a starting price of {spotPrice}{' '}
                            SOL.
                          </Paragraph>
                        )}
                        {Boolean(delta) && (
                          <Paragraph>
                            each time your pool {type}s an NFT, your {type}{' '}
                            price will adjust up by {delta} {unit}.
                          </Paragraph>
                        )}
                      </Card>
                    </Col>
                    <Col span={11} offset={2}>
                      {isTokenForNFTPool && (
                        <Card bordered={false}>
                          <Title level={3}>assets</Title>
                          <Form.Item label="amount of NFTs" name="nftAmount">
                            <InputNumber
                              className={styles.input}
                              min={0}
                              addonAfter="NFTs"
                            />
                          </Form.Item>
                        </Card>
                      )}
                      {isNftForTokenPool && (
                        <Card bordered={false}>
                          <Title level={3}>assets</Title>
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
                            + select NFTs
                          </Button>
                        </Card>
                      )}
                      {isLiquidityProvisionPool && (
                        <Card bordered={false}>
                          <Title level={3}>assets</Title>
                          <Form.Item
                            label="buy orders amount"
                            name="buyOrdersAmount"
                          >
                            <InputNumber
                              disabled={Boolean(nftModal.selectedNfts.length)}
                              className={styles.input}
                              max={
                                isSelectedButtonDisabled
                                  ? pool?.buyOrdersAmount
                                  : buyOrdersAmount
                              }
                              min={0}
                              step={2}
                              addonAfter="NFTs"
                            />
                          </Form.Item>
                          <div className={styles.nftsWrapper}>
                            {nftModal.selectedNfts.map((nft) => (
                              <NFTCard
                                // className={styles.nfts}
                                key={nft.mint}
                                imageUrl={nft.imageUrl}
                              />
                            ))}
                          </div>
                          <Button
                            disabled={isSelectedButtonDisabled}
                            onClick={onSelectNftsClick}
                          >
                            + select NFTs
                          </Button>
                        </Card>
                      )}
                    </Col>
                  </Row>
                </div>
                <div className={styles.stepsButtons}>
                  <Button
                    type="primary"
                    onClick={onSavePoolClick}
                    disabled={isSaveButtonDisabled}
                  >
                    save changes
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
