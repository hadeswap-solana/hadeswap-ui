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
import Button from '../../../components/Buttons/Button';
import Chart from '../../../components/Chart/Chart';
import usePriceGraph from '../../../components/Chart/hooks/usePriceGraph';
import { useCreatePool } from '../hooks';
import { useFetchAllMarkets } from '../../../requests';
import {
  selectAllMarkets,
  selectAllMarketsLoading,
} from '../../../state/core/selectors';
import { getRawDelta, getRawSpotPrice } from '../../../utils';

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
    buyOrdersAmount = 0,
  } = usePoolServiceAssets({ marketPublicKey: chosenMarketKey });

  const { formValue, setFormValue } = usePoolServicePrice({});

  const initialValuesAssets = useMemo(
    () => ({
      buyOrdersAmount: 0,
    }),
    [],
  );

  const rawDelta = getRawDelta({
    delta: formValue.delta,
    curveType: formValue.curveType,
    buyOrdersAmount,
    nftsAmount: selectedNfts.length,
    pairType,
    mathCounter: 0,
  });

  const rawSpotPrice = getRawSpotPrice({
    rawDelta,
    spotPrice: formValue.spotPrice,
    curveType: formValue.curveType,
    mathCounter: 0,
  });

  const rawFee = formValue.fee * 100;

  const isCreateButtonDisabled =
    (pairType !== PairType.TokenForNFT && !selectedNfts.length) ||
    (pairType === PairType.TokenForNFT && !buyOrdersAmount) ||
    !formValue.spotPrice;

  const creationSpotPrice = Math.ceil(formValue.spotPrice * 1e9);

  const { create: onCreatePoolClick } = useCreatePool({
    pairType,
    buyOrdersAmount,
    marketPubkey: chosenMarketKey,
    selectedNfts,
    curveType: formValue.curveType,
    rawSpotPrice: creationSpotPrice,
    rawDelta: rawDelta,
    rawFee,
    onAfterTxn: () => history.push('/my-pools'),
  });

  const chartData = usePriceGraph({
    baseSpotPrice: rawSpotPrice,
    rawDelta: rawDelta,
    rawFee,
    bondingCurve: formValue.curveType,
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
              formValue={formValue}
              setFormValue={setFormValue}
              pairType={pairType}
              chosenMarket={chosenMarket}
              buyOrdersAmount={buyOrdersAmount}
              nftsCount={selectedNfts.length}
              rawDelta={rawDelta}
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
