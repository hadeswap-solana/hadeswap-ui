import { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  BondingCurveType,
  PairType,
} from 'hadeswap-sdk/lib/hadeswap-core/types';
import { Spinner } from '../../../components/Spinner/Spinner';
import { PriceBlock } from '../../../components/PoolSettings/PriceBlock';
import { AssetsBlock } from '../../../components/PoolSettings/AssetsBlock';
import { usePoolServicePrice } from '../../../components/PoolSettings/hooks/usePoolServicePrice';
import { usePoolServiceAssets } from '../../../components/PoolSettings/hooks/usePoolServiceAssets';
import { useAssetsSetHeight } from '../../../components/PoolSettings/hooks/useAssetsSetHeight';
import { Chart, usePriceGraph } from '../../../components/Chart';
import Button from '../../../components/Buttons/Button';
import { useCreatePool } from '../hooks';
import { useFetchAllMarkets } from '../../../requests';
import {
  selectAllMarkets,
  selectAllMarketsLoading,
} from '../../../state/core/selectors';

import styles from './styles.module.scss';
import { deriveXykBaseSpotPriceFromCurrentSpotPrice } from 'hadeswap-sdk/lib/hadeswap-core/helpers';

interface StepThreeProps {
  pairType: PairType;
  chosenMarketKey: string;
}

export const StepThree: FC<StepThreeProps> = ({
  pairType,
  chosenMarketKey,
}) => {
  useFetchAllMarkets();
  const history = useHistory();
  const markets = useSelector(selectAllMarkets);
  const marketsLoading = useSelector(selectAllMarketsLoading);

  const chosenMarket = markets.find(
    (market) => market.marketPubkey === chosenMarketKey,
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
  } = usePoolServiceAssets({ marketPublicKey: chosenMarketKey });

  const {
    formPrice,
    fee,
    spotPrice,
    delta = 0,
    curveType,
    setCurveType,
  } = usePoolServicePrice({});

  const initialValuesAssets = useMemo(
    () => ({
      buyOrdersAmount: 0,
    }),
    [],
  );

  const initialValuesPrice = useMemo(
    () => ({
      fee: 0,
      spotPrice: 0,
      delta: 0,
    }),
    [],
  );

  const rawDelta =
    curveType === BondingCurveType.Exponential
      ? delta * 100
      : (delta || 0) * 1e9;

  const parsedDeltaForXyk =
    curveType === BondingCurveType.XYK
      ? Math.ceil(
          (buyOrdersAmount + selectedNfts.length) /
            (pairType === PairType.LiquidityProvision ? 2 : 1),
        )
      : rawDelta;
  const rawSpotPrice =
    curveType === BondingCurveType.XYK
      ? deriveXykBaseSpotPriceFromCurrentSpotPrice({
          currentSpotPrice: spotPrice * 1e9,
          counter: 0,
          delta: parsedDeltaForXyk,
        })
      : spotPrice * 1e9;

  const rawFee = fee * 100;

  const isCreateButtonDisabled =
    (pairType !== PairType.TokenForNFT && !selectedNfts.length) ||
    (pairType === PairType.TokenForNFT && !buyOrdersAmount) ||
    !spotPrice;

  const { create: onCreatePoolClick } = useCreatePool({
    pairType,
    buyOrdersAmount,
    marketPubkey: chosenMarketKey,
    selectedNfts,
    curveType,
    rawSpotPrice,
    rawDelta: parsedDeltaForXyk,
    rawFee,
    onAfterTxn: () => history.push('/my-pools'),
  });

  const chartData = usePriceGraph({
    baseSpotPrice: rawSpotPrice,
    rawDelta: parsedDeltaForXyk,
    rawFee: rawFee || 0,
    bondingCurve: curveType,
    buyOrdersAmount,
    nftsCount: selectedNfts.length,
    type: pairType,
  });

  const { assetsBlockRef, priceBlockRef } = useAssetsSetHeight(pairType);

  const isLoading = marketsLoading || nftsLoading;

  return (
    <div className={styles.settingsBlockWrapper}>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <div className={styles.settingsBlock}>
            <PriceBlock
              ref={priceBlockRef}
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
            />
            <AssetsBlock
              ref={assetsBlockRef}
              nfts={nfts}
              toggleNft={toggleNft}
              selectedNfts={selectedNfts}
              pairType={pairType}
              form={formAssets}
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
          <div className={styles.settingsButtonsWrapper}>
            <Button
              isDisabled={isCreateButtonDisabled}
              onClick={onCreatePoolClick}
            >
              <span>create pool</span>
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
