import { FC } from 'react';
import { useFetchAllMarkets, useFetchPair } from '../../requests';
import { useSelector } from 'react-redux';
import {
  selectAllMarkets,
  selectAllMarketsLoading,
  selectCertainPair,
  selectCertainPairLoading
} from '../../state/core/selectors';
import { useNftsPool } from '../../hooks/useNftsPool';
import { AppLayout } from '../../components/Layout/AppLayout';
import PageContentLayout from '../../components/Layout/PageContentLayout';
import { Spinner } from '../../components/Spinner/Spinner';
import { Card } from '../../components/Card';
import Button from '../../components/Buttons/Button';

import styles from './styles.module.scss';
import { BondingCurveType, OrderType, PairType } from 'hadeswap-sdk/lib/hadeswap-core/types';
//import { differenceBy } from 'lodash';
import { useWallet } from '@solana/wallet-adapter-react';
import { Form, InputNumber, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { PairButtons } from '../../components/Buttons/PairButtons';
import { helpers } from 'hadeswap-sdk/lib/hadeswap-core';
import { renamePairType } from '../../state/core/helpers';
// import ChartLine from '../../components/ChartLine/ChartLine';
import classNames from 'classnames';
import { NFTCard } from '../../components/NFTCard/NFTCard';

export const EditPool: FC = () => {
  const { connected } = useWallet();

  useFetchAllMarkets();
  useFetchPair();

  const markets = useSelector(selectAllMarkets);
  const pool = useSelector(selectCertainPair);
  const marketLoading = useSelector(selectAllMarketsLoading);
  const poolLoading = useSelector(selectCertainPairLoading);

  const curveType = pool?.bondingCurve;
  const deltaType = curveType === BondingCurveType.Exponential ? '%' : 'SOL';
  const accumulatedFees = pool?.liquidityProvisionOrders.reduce(
    (acc, order) => acc + order.accumulatedFee, 0);

  const pairType = pool?.type;

  const isLiquidityProvisionPool = pairType === PairType.LiquidityProvision;
  const isNftForTokenPool = pairType === PairType.NftForToken;
  const isTokenForNFTPool = pairType === PairType.TokenForNFT;

  const chosenMarket = markets.find(
    (item) => item.marketPubkey === pool?.market,
  );
  //const collectionName = chosenMarket?.collectionName ?? 'nfts';

  const {
    nfts,
    selectedNfts,
    selectedNftsByMint,
    toggleNft,
    nftsLoading,
  } = useNftsPool({
    marketPublicKey: chosenMarket?.marketPubkey,
    preSelectedNfts: pool?.sellOrders,
  });

  // const nftsToDelete = differenceBy(
  //   pool?.sellOrders,
  //   selectedNfts,
  //   'mint',
  // );
  //const nftsToAdd = selectedNfts.filter((nft) => !nft.nftPairBox);

  const [formPrice] = Form.useForm();
  const [formAssets] = Form.useForm();

  //const fee = Form.useWatch('fee', formPrice);
  const spotPrice = Form.useWatch('spotPrice', formPrice);
  const delta = Form.useWatch('delta', formPrice);
  //const nftAmount = Form.useWatch('nftAmount', formAssets);
  const buyOrdersAmount = Form.useWatch('buyOrdersAmount', formAssets);

  const initialValuesPrice = {
    fee: pool?.fee / 100,
    spotPrice: pool?.currentSpotPrice / 1e9,
    delta:
      curveType === BondingCurveType.Exponential
        ? pool?.delta / 100
        : pool?.delta / 1e9,
  };

  const initialValuesAssets = {
    nftAmount: pool?.buyOrdersAmount,
    buyOrdersAmount: pool?.buyOrdersAmount,
  };

  const isDisableFields = true;
  //const isDisableFields = !isNftForTokenPool && pool?.buyOrdersAmount > 20;
  const isSelectedButtonDisabled = buyOrdersAmount < pool?.buyOrdersAmount;

  const isLoading = marketLoading || poolLoading || nftsLoading;
  //const isLoading = marketLoading || poolLoading;
  //let walletNfts = [...pool?.sellOrders, ...nftModal.walletNfts];
  return (
    <AppLayout>
      <PageContentLayout title="edit pool">
        {!connected ? <h2 className={styles.h2}>connect your wallet for pool creation</h2>
          : isLoading ? (<Spinner />
          ) : (
            <div className={styles.settingsBlockWrapper}>
              <div className={styles.settingsBlock}>
                <div className={styles.settingsBlockPriceWrapper}>
                  <Card className={styles.settingsBlockCard}>
                    {isDisableFields && (
                      <p className={styles.h2}>
                        you can edit &quot;spot price&quot; and &quot;delta&quot; only if you have less than 20 buy
                        orders
                      </p>
                    )}
                    <h2 className={styles.settingsBlockTitle}>pricing</h2>
                    <Form form={formPrice} initialValues={initialValuesPrice}>
                      {isLiquidityProvisionPool && (
                        <>
                          <h3 className={styles.settingsBlockSubTitle}>fee</h3>
                          <Form.Item name="fee">
                            <InputNumber min={0} max={99.5} addonAfter="%" />
                          </Form.Item>
                        </>
                      )}
                      <h3 className={styles.settingsBlockSubTitle}>
                        {`spot price ${
                          chosenMarket
                            ? `(current best offer: ${chosenMarket?.bestoffer} SOL, current floor price: ${chosenMarket?.floorPrice} SOL)`
                            : ''
                        }`}
                        <Tooltip
                          placement="top"
                          title="the starting price of your pool"
                        >
                          <InfoCircleOutlined />
                        </Tooltip>
                      </h3>
                      <Form.Item name="spotPrice">
                        <InputNumber
                          disabled={isDisableFields}
                          min={!isTokenForNFTPool
                            ? chosenMarket?.bestoffer === '0.000'
                              ? 0 : chosenMarket?.bestoffer : 0
                          }
                          max={!isNftForTokenPool
                            ? chosenMarket?.floorPrice === '0.000'
                              ? 100000000
                              : chosenMarket?.floorPrice
                            : 100000000
                          }
                          addonAfter="SOL"
                        />
                      </Form.Item>
                      <h3 className={styles.settingsBlockSubTitle}>
                        bonding curve
                        <Tooltip
                          placement="top"
                          title="controls how your pool\'s price will change"
                        >
                          <InfoCircleOutlined />
                        </Tooltip>
                      </h3>
                      <PairButtons
                        isDisabled
                        className={styles.pairButtonsWrapper}
                        valueButtonLeft="linear curve"
                        valueButtonRight="exponential curve"
                        isActiveLeft={curveType === BondingCurveType.Linear}
                        isActiveRight={curveType === BondingCurveType.Exponential}
                      />
                      <h3 className={styles.settingsBlockSubTitle}>
                        delta
                        <Tooltip
                          placement="top"
                          title="how much your pool price changes with each sell/buy"
                        >
                          <InfoCircleOutlined />
                        </Tooltip>
                      </h3>
                      <Form.Item name="delta">
                        <InputNumber
                          disabled={isDisableFields}
                          addonAfter={deltaType}
                          min="0"
                        />
                      </Form.Item>
                      {!isNftForTokenPool &&
                        <p className={styles.settingsBlockText}>
                          starting buying price {spotPrice} SOL
                        </p>
                      }
                      {!isTokenForNFTPool &&
                        <p className={styles.settingsBlockText}>
                          starting selling price{' '}
                          {helpers.calculateNextSpotPrice({
                            orderType: OrderType.Buy,
                            delta: delta,
                            spotPrice: spotPrice,
                            bondingCurveType: curveType,
                            counter: 0,
                          })}{' '}
                          SOL
                        </p>
                      }
                      {!!delta && (
                        <p className={styles.settingsBlockText}>
                          each time your pool {renamePairType(pairType)}s an NFT, your{' '}
                          {renamePairType(pairType)} price will adjust up by {delta}{' '}
                          {deltaType}
                        </p>
                      )}
                    </Form>
                  </Card>
                  <Card className={styles.settingsBlockCard}>
                    <h2 className={styles.settingsBlockTitle}>fees</h2>
                    <InputNumber
                      disabled
                      addonAfter="SOL"
                      value={accumulatedFees}
                    />
                    <Button
                      outlined
                      isDisabled={!accumulatedFees}
                      onClick={null}
                    >
                      <span>withdraw</span>
                    </Button>
                  </Card>
                </div>
                <div className={styles.settingsBlockAssetsWrapper}>
                  <Card
                    className={classNames(
                      styles.settingsBlockCard,
                      styles.settingsBlockAssets,
                    )}
                  >
                    <h2 className={styles.settingsBlockTitle}>assets</h2>
                    <Form form={formAssets} initialValues={initialValuesAssets}>
                      {isTokenForNFTPool &&
                        <>
                          <h3 className={styles.settingsBlockSubTitle}>
                            amount of NFTs
                          </h3>
                          <Form.Item name="nftAmount">
                            <InputNumber min="0" addonAfter="NFTs" />
                          </Form.Item>
                        </>
                      }
                      {isNftForTokenPool &&
                        <div className={styles.settingBlockNftsWrapper}>
                          {nfts.map((nft) => (
                            <NFTCard
                              key={nft.mint}
                              className={styles.nftCard}
                              imageUrl={nft.imageUrl}
                              name={nft.name}
                              selected={!!selectedNftsByMint[nft.mint]}
                              onCardClick={() => toggleNft(nft)}
                              wholeAreaSelect
                              simpleCard
                            />
                          ))}
                        </div>
                      }
                      {isLiquidityProvisionPool &&
                        <>
                          <h3 className={styles.settingsBlockSubTitle}>
                            buy orders amount
                          </h3>
                          <Form.Item name="buyOrdersAmount">
                            <InputNumber
                              disabled={Boolean(selectedNfts.length)}
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
                          <div className={styles.settingBlockNftsWrapper}>
                            {nfts.map((nft) => (
                              <NFTCard
                                key={nft.mint}
                                className={styles.nftCard}
                                imageUrl={nft.imageUrl}
                                name={nft.name}
                                selected={!!selectedNftsByMint[nft.mint]}
                                onCardClick={() => toggleNft(nft)}
                                wholeAreaSelect
                                simpleCard
                              />
                            ))}
                          </div>
                        </>
                      }
                    </Form>
                  </Card>
                </div>
              </div>
              {/*<div className={styles.chartWrapper}>*/}
              {/*  <ChartLine*/}
              {/*    create*/}
              {/*    baseSpotPrice={spotPrice * 1e9}*/}
              {/*    delta={rawDelta}*/}
              {/*    fee={fee}*/}
              {/*    type={pairType}*/}
              {/*    bondingCurve={curveType}*/}
              {/*    buyOrdersAmount={nftAmount}*/}
              {/*    nftsCount={selectedNfts.length}*/}
              {/*  />*/}
              {/*</div>*/}
            </div>
          )}
      </PageContentLayout>
    </AppLayout>
  );
};
