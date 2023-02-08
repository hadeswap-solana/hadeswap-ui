import { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { PairType } from 'hadeswap-sdk/lib/hadeswap-core/types';
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
import Button from '../../components/Buttons/Button';
import { useWithdrawFees } from '../../components/WithdrawFees/useWithdrawFees';
import { useCloseClick } from './hooks/useCloseClick';
import usePriceGraph from '../../components/Chart/hooks/usePriceGraph';
import { usePoolChange } from '../../hadeswap/hooks';
import { getRawDelta, getRawSpotPrice } from '../../utils';
import styles from './styles.module.scss';
import Chart from '../../components/Chart/Chart';
import { chartIDs } from '../../components/Chart/constants';

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

  const { formValue, setFormValue } = usePoolServicePrice({ pool });

  const initialValuesAssets = useMemo(
    () => ({
      buyOrdersAmount: pool?.buyOrdersAmount,
    }),
    [pool?.buyOrdersAmount],
  );

  const rawDelta = getRawDelta({
    delta: formValue.delta,
    curveType: formValue.curveType,
    buyOrdersAmount,
    nftsAmount: selectedNfts.length,
    pairType,
    mathCounter: pool?.mathCounter,
  });

  const rawSpotPrice = getRawSpotPrice({
    rawDelta,
    spotPrice: formValue.spotPrice,
    curveType: formValue.curveType,
    mathCounter: pool?.mathCounter,
  });

  const rawFee = formValue.fee * 100;
  const changeSpotPrice = getRawSpotPrice({
    rawDelta: pool?.delta,
    spotPrice: formValue.spotPrice,
    curveType: formValue.curveType,
    mathCounter: pool?.mathCounter,
  });

  const { change, isChanged, withdrawAllLiquidity, isWithdrawAllAvailable } =
    usePoolChange({
      pool,
      selectedNfts,
      buyOrdersAmount,
      rawFee,
      rawDelta,
      rawSpotPrice: changeSpotPrice,
    });

  const { onWithdrawClick, accumulatedFees, isWithdrawDisabled } =
    useWithdrawFees({ pool });

  const { onCloseClick, isClosePoolDisabled } = useCloseClick({ pool });

  const chartData = usePriceGraph({
    baseSpotPrice: rawSpotPrice,
    rawDelta,
    rawFee,
    buyOrdersAmount,
    nftsCount: selectedNfts.length,
    bondingCurve: formValue.curveType,
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
                pairType={pairType}
                chosenMarket={chosenMarket}
                formValue={formValue}
                setFormValue={setFormValue}
                buyOrdersAmount={buyOrdersAmount}
                nftsCount={selectedNfts.length}
                pool={pool}
                rawDelta={rawDelta}
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
            <Chart
              title="price graph"
              data={chartData}
              chartID={chartIDs.priceGraph}
            />
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
