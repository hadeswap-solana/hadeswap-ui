import { FC, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  BondingCurveType,
  PairType,
} from 'hadeswap-sdk/lib/hadeswap-core/types';
import { Spinner } from '../../../components/Spinner/Spinner';
import { PriceBlock } from '../../../components/PoolSettings/PriceBlock';
import { AssetsBlock } from '../../../components/PoolSettings/AssetsBlock';
import { usePoolServicePrice } from '../../../components/PoolSettings/hooks/usePoolServicePrice';
import { usePoolServiceAssets } from '../../../components/PoolSettings/hooks/usePoolServiceAssets';
import Button from '../../../components/Buttons/Button';
import { useOnCreatePoolClick } from '../hooks';
import { useFetchAllMarkets } from '../../../requests';
import {
  selectAllMarkets,
  selectAllMarketsLoading,
} from '../../../state/core/selectors';

import styles from './styles.module.scss';
import { Chart, usePriceGraph } from '../../../components/Chart';

interface StepThreeProps {
  pairType: PairType;
  chosenMarketKey: string;
}

export const StepThree: FC<StepThreeProps> = ({
  pairType,
  chosenMarketKey,
}) => {
  useFetchAllMarkets();
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
    nftAmount,
  } = usePoolServiceAssets({ marketPublicKey: chosenMarketKey });

  const { formPrice, fee, spotPrice, delta, curveType, setCurveType } =
    usePoolServicePrice({});

  const initialValuesPrice = {
    fee: 0,
    spotPrice: 0,
    delta: 0,
  };

  const initialValuesAssets = { nftAmount: 0 };

  const rawSpotPrice = spotPrice * 1e9;
  const rawDelta =
    curveType === BondingCurveType.Exponential ? delta * 100 : delta * 1e9;
  const rawFee = fee * 100;

  const isCreateButtonDisabled =
    (pairType !== PairType.TokenForNFT && !selectedNfts.length) ||
    (pairType === PairType.TokenForNFT && !nftAmount) ||
    !spotPrice;

  const onCreatePoolClick = useOnCreatePoolClick({
    pairType,
    nftAmount,
    chosenMarketKey,
    selectedNfts,
    curveType,
    rawSpotPrice,
    rawDelta,
    rawFee,
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
  });

  const isLoading = marketsLoading || nftsLoading;

  const chartData = usePriceGraph({
    baseSpotPrice: spotPrice * 1e9,
    delta: rawDelta,
    fee: rawFee || 0,
    bondingCurve: curveType,
    buyOrdersAmount: nftAmount,
    nftsCount: selectedNfts.length,
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
          <div className={styles.chartWrapper}>
            {!!chartData && !!chartData?.length && (
              <Chart title="price graph" data={chartData} />
            )}
          </div>
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
