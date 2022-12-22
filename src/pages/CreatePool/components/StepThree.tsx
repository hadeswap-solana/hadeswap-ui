import { FC, useRef, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { PairType } from 'hadeswap-sdk/lib/hadeswap-core/types';
import { Spinner } from '../../../components/Spinner/Spinner';
import { PriceBlock } from '../../../components/PoolSettings/PriceBlock';
import { AssetsBlock } from '../../../components/PoolSettings/AssetsBlock';
import { usePoolServicePrice } from '../../../components/PoolSettings/hooks/usePoolServicePrice';
import { usePoolServiceAssets } from '../../../components/PoolSettings/hooks/usePoolServiceAssets';
import { Chart, usePriceGraph } from '../../../components/Chart';
import Button from '../../../components/Buttons/Button';
import { useCreatePool } from '../hooks';
import { useFetchAllMarkets } from '../../../requests';
import {
  selectAllMarkets,
  selectAllMarketsLoading,
} from '../../../state/core/selectors';

import styles from './styles.module.scss';

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
    buyOrdersAmount,
  } = usePoolServiceAssets({ marketPublicKey: chosenMarketKey });

  const {
    formPrice,
    fee,
    rawFee,
    spotPrice,
    rawSpotPrice,
    delta,
    rawDelta,
    curveType,
    setCurveType,
  } = usePoolServicePrice({ selectedNftsAmount: selectedNfts.length });

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
    rawDelta,
    rawFee,
    onAfterTxn: () => history.push('/my-pools'),
  });

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
  }, [pairType]);

  const isLoading = marketsLoading || nftsLoading;

  const chartData = usePriceGraph({
    baseSpotPrice: spotPrice * 1e9,
    delta: rawDelta,
    fee: rawFee || 0,
    bondingCurve: curveType,
    buyOrdersAmount,
    nftsCount: selectedNfts.length,
    type: pairType,
  });

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
              nftsCount={selectedNfts.length}
              fee={fee}
              buyOrdersAmount={buyOrdersAmount}
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
