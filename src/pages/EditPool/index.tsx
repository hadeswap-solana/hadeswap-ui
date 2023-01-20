import { FC, useMemo } from 'react';
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
import { useAssetsSetHeight } from '../../components/PoolSettings/hooks/useAssetsSetHeight';
import { Spinner } from '../../components/Spinner/Spinner';
import { WithdrawFees } from '../../components/WithdrawFees';
import { Chart, usePriceGraph } from '../../components/Chart';
import Button from '../../components/Buttons/Button';
import { useWithdrawFees } from '../../components/WithdrawFees/useWithdrawFees';
import { useCloseClick } from './hooks/useCloseClick';
import { usePoolChange } from '../../hadeswap/hooks';
import styles from './styles.module.scss';
import { deriveXykBaseSpotPriceFromCurrentSpotPrice } from 'hadeswap-sdk/lib/hadeswap-core/helpers';

export const EditPool: FC = () => {
  const { connected } = useWallet();

  useFetchAllMarkets();
  useFetchPair();

  const markets = useSelector(selectAllMarkets);
  const pool = useSelector(selectCertainPair);
  const marketLoading = useSelector(selectAllMarketsLoading);
  const poolLoading = useSelector(selectCertainPairLoading);

  const pairType = pool?.type;

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
    buyOrdersAmount = 0,
  } = usePoolServiceAssets({
    marketPublicKey: chosenMarket?.marketPubkey,
    preSelectedNfts: pool?.sellOrders,
  });

  const { formPrice, fee, spotPrice, delta, curveType, setCurveType } =
    usePoolServicePrice({ pool });

  const initialValuesAssets = useMemo(
    () => ({
      buyOrdersAmount: pool?.buyOrdersAmount,
    }),
    [pool?.buyOrdersAmount],
  );
  const deltaSerializer = (delta: number, curveType: BondingCurveType) => {
    if (curveType === BondingCurveType.Exponential) return delta * 100;
    if (curveType === BondingCurveType.Linear) return delta * 1e9;
    if (curveType === BondingCurveType.XYK)
      return Math.ceil(
        (buyOrdersAmount + selectedNfts.length) /
          (pairType === PairType.LiquidityProvision ? 2 : 1),
      );
  };

  const rawDelta = deltaSerializer(delta, curveType);

  const initialValuesPrice = useMemo(
    () => ({
      fee: pool?.fee / 100,
      spotPrice: pool?.currentSpotPrice / 1e9,
      delta: rawDelta,
    }),
    [pool, rawDelta],
  );

  const rawSpotPrice =
    curveType === BondingCurveType.XYK
      ? deriveXykBaseSpotPriceFromCurrentSpotPrice({
          currentSpotPrice: spotPrice * 1e9,
          counter: pool?.mathCounter,
          delta: rawDelta,
        })
      : spotPrice * 1e9;

  const { change, isChanged, withdrawAllLiquidity, isWithdrawAllAvailable } =
    usePoolChange({
      pool,
      selectedNfts,
      buyOrdersAmount,
      rawFee: fee * 100,
      rawDelta,
      rawSpotPrice,
    });

  const { onWithdrawClick, accumulatedFees, isWithdrawDisabled } =
    useWithdrawFees({ pool });

  const { onCloseClick, isClosePoolDisabled } = useCloseClick({ pool });

  const chartData = usePriceGraph({
    baseSpotPrice: rawSpotPrice,
    rawDelta,
    rawFee: fee * 100 || 0,
    buyOrdersAmount,
    nftsCount: selectedNfts.length,
    bondingCurve: curveType,
    mathCounter: pool?.mathCounter,
    type: pairType,
  });

  const { assetsBlockRef, priceBlockRef } = useAssetsSetHeight(pairType);

  const isLoading = marketLoading || poolLoading || nftsLoading;

  return (
    <AppLayout>
      <PageContentLayout title="edit pool">
        {!connected ? (
          <h2 className={styles.h2}>connect your wallet for pool creation</h2>
        ) : isLoading ? (
          <Spinner />
        ) : (
          <>
            {pairType === PairType.LiquidityProvision && (
              <WithdrawFees
                className={styles.withdrawBlock}
                accumulatedFees={accumulatedFees}
                onClick={onWithdrawClick}
                isButtonDisabled={isWithdrawDisabled}
              />
            )}
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
                fee={fee}
                buyOrdersAmount={buyOrdersAmount}
                nftsCount={selectedNfts.length}
                formInitialValues={initialValuesPrice}
                pool={pool}
              />
              <AssetsBlock
                ref={assetsBlockRef}
                selectedNfts={selectedNfts}
                pairType={pairType}
                form={formAssets}
                nfts={nfts}
                toggleNft={toggleNft}
                selectAll={selectAll}
                deselectAll={deselectAll}
                formInitialValues={initialValuesAssets}
              />
            </div>
            {!!chartData && !!chartData?.length && (
              <div className={styles.chartWrapper}>
                <Chart title="price graph" data={chartData} />
              </div>
            )}
            <div className={styles.buttonsWrapper}>
              <Button isDisabled={!isChanged} onClick={change}>
                <span>save changes</span>
              </Button>
              <Button
                outlined
                isDisabled={!isWithdrawAllAvailable}
                onClick={withdrawAllLiquidity}
              >
                <span>withdraw all liquidity</span>
              </Button>
              <Button
                outlined
                isDisabled={isClosePoolDisabled}
                onClick={onCloseClick}
              >
                <span>close pool</span>
              </Button>
            </div>
          </>
        )}
      </PageContentLayout>
    </AppLayout>
  );
};
