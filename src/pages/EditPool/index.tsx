import { FC, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  BondingCurveType,
  PairType,
} from 'hadeswap-sdk/lib/hadeswap-core/types';
import { useWallet } from '@solana/wallet-adapter-react';
import { useFetchAllMarkets, useFetchPair } from '../../requests';
import {
  selectAllMarkets,
  selectAllMarketsLoading,
  selectCertainPair,
  selectCertainPairLoading,
} from '../../state/core/selectors';
import { AppLayout } from '../../components/Layout/AppLayout';
import PageContentLayout from '../../components/Layout/PageContentLayout';
import { PriceBlock } from '../../components/PoolSettings/PriceBlock';
import { AssetsBlock } from '../../components/PoolSettings/AssetsBlock';
import { usePoolServicePrice } from '../../components/PoolSettings/hooks/usePoolServicePrice';
import { usePoolServiceAssets } from '../../components/PoolSettings/hooks/usePoolServiceAssets';
import { Spinner } from '../../components/Spinner/Spinner';
import { Card } from '../../components/Card';
import Button from '../../components/Buttons/Button';
import { useSaveClick } from './hooks/useSaveClick';
import {
  useWithdrawAllClick,
  useWithdrawClick,
} from './hooks/useWithdrawClick';
import { useCloseClick } from './hooks/useCloseClick';

import styles from './styles.module.scss';

export const EditPool: FC = () => {
  const { connected } = useWallet();

  useFetchAllMarkets();
  useFetchPair();

  const markets = useSelector(selectAllMarkets);
  const pool = useSelector(selectCertainPair);
  const marketLoading = useSelector(selectAllMarketsLoading);
  const poolLoading = useSelector(selectCertainPairLoading);

  const chosenMarket = markets.find(
    (item) => item.marketPubkey === pool?.market,
  );

  const {
    nfts,
    selectedNfts,
    toggleNft,
    selectAll,
    deselectAll,
    nftsLoading,
    formAssets,
    nftAmount,
    buyOrdersAmount,
  } = usePoolServiceAssets({
    marketPublicKey: chosenMarket?.marketPubkey,
    preSelectedNfts: pool?.sellOrders,
  });

  const { formPrice, fee, spotPrice, delta, curveType, setCurveType } =
    usePoolServicePrice({ pool });

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

  const accumulatedFees = pool?.liquidityProvisionOrders.reduce(
    (acc, order) => acc + order.accumulatedFee,
    0,
  );

  const pairType = pool?.type;

  const rawSpotPrice = spotPrice * 1e9;
  const rawDelta =
    curveType === BondingCurveType.Exponential ? delta * 100 : delta * 1e9;

  const onSaveClick = useSaveClick({
    pool,
    curveType,
    fee,
    nftAmount,
    pairType,
    selectedNfts,
    buyOrdersAmount,
    rawSpotPrice,
    rawDelta,
  });

  const onWithdrawClick = useWithdrawClick({ pool });
  const onWithdrawAllClick = useWithdrawAllClick({
    pool,
    pairType,
    rawSpotPrice,
    rawDelta,
    curveType,
  });

  const onCloseClick = useCloseClick({ pool });

  const isLoading = marketLoading || poolLoading || nftsLoading;

  const assetsBlockRef = useRef<HTMLDivElement>();
  const priceBlockRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (
      assetsBlockRef.current &&
      priceBlockRef.current &&
      pairType !== PairType.TokenForNFT
    ) {
      assetsBlockRef.current.style.height = `${priceBlockRef.current.offsetHeight}px`;
    }
  });

  return (
    <AppLayout>
      <PageContentLayout title="edit pool">
        {!connected ? (
          <h2 className={styles.h2}>connect your wallet for pool creation</h2>
        ) : isLoading ? (
          <Spinner />
        ) : (
          <>
            <Card className={styles.withdrawCard}>
              <div className={styles.withdrawInfoWrapper}>
                <span className={styles.withdrawTitle}>fees</span>
                <span className={styles.withdrawValue}>{accumulatedFees}</span>
              </div>
              <Button
                outlined
                className={styles.withdrawButton}
                onClick={onWithdrawClick}
              >
                <span>withdraw</span>
              </Button>
            </Card>
            <div className={styles.settingsBlock}>
              <PriceBlock
                ref={priceBlockRef}
                editMode
                form={formPrice}
                pairType={pairType}
                chosenMarket={chosenMarket}
                curveType={curveType}
                setCurveType={setCurveType}
                spotPrice={spotPrice}
                delta={delta}
                formInitialValues={initialValuesPrice}
                pool={pool}
              />
              <AssetsBlock
                ref={assetsBlockRef}
                editMode
                selectedNfts={selectedNfts}
                pairType={pairType}
                nfts={nfts}
                toggleNft={toggleNft}
                selectAll={selectAll}
                deselectAll={deselectAll}
                form={formAssets}
                formInitialValues={initialValuesAssets}
                pool={pool}
                buyOrdersAmount={buyOrdersAmount}
              />
            </div>
            <div className={styles.buttonsWrapper}>
              <Button onClick={onSaveClick}>
                <span>save changes</span>
              </Button>
              <Button outlined onClick={onWithdrawAllClick}>
                <span>withdraw all liquidity</span>
              </Button>
              <Button outlined onClick={onCloseClick}>
                <span>close pool</span>
              </Button>
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
          </>
        )}
      </PageContentLayout>
    </AppLayout>
  );
};
