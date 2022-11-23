import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  BondingCurveType,
  PairType,
  OrderType,
} from 'hadeswap-sdk/lib/hadeswap-core/types';
import { helpers } from 'hadeswap-sdk/lib/hadeswap-core';
import { Form, InputNumber } from 'antd';
import { Spinner } from '../../../components/Spinner/Spinner';
import { Card } from '../../../components/Card';
import { PairButtons } from '../../../components/Buttons/PairButtons';
import Button from '../../../components/Buttons/Button';
import { NFTCard } from '../../../components/NFTCard/NFTCard';
import {
  SelectNftsModal,
  useSelectNftsModal,
} from '../../../components/SelectNftsModal/SelectNftsModal';
import ChartLine from '../../../components/ChartLine/ChartLine';
import { useOnCreatePoolClick } from '../hooks';
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
  const [curveType, setCurveType] = useState<BondingCurveType>(
    BondingCurveType.Linear,
  );

  useFetchAllMarkets();
  const markets = useSelector(selectAllMarkets);
  const isLoading = useSelector(selectAllMarketsLoading);

  const chosenMarket = markets.find(
    (market) => market.marketPubkey === chosenMarketKey,
  );
  const deltaType = curveType === BondingCurveType.Exponential ? '%' : 'SOL';

  const [formPrice] = Form.useForm();
  const [formAssets] = Form.useForm();
  const fee = Form.useWatch('fee', formPrice);
  const spotPrice = Form.useWatch('spotPrice', formPrice);
  const delta = Form.useWatch('delta', formPrice);
  const nftAmount = Form.useWatch('nftAmount', formAssets);

  const nftModal = useSelectNftsModal(chosenMarketKey);

  const rawSpotPrice = spotPrice * 1e9;
  const rawDelta =
    curveType === BondingCurveType.Exponential ? delta * 100 : delta * 1e9;
  const rawFee = fee * 100;

  const isCreateButtonDisabled =
    (pairType !== PairType.TokenForNFT && !nftModal.selectedNfts.length) ||
    (pairType === PairType.TokenForNFT && !nftAmount) ||
    !spotPrice;

  const initialValuesPrice = {
    fee: 0,
    spotPrice: 0,
    delta: 0,
  };

  const initialValuesAssets = { nftAmount: 0 };

  const onCreatePoolClick = useOnCreatePoolClick({
    pairType,
    nftAmount,
    chosenMarketKey,
    nftModal,
    curveType,
    rawSpotPrice,
    rawDelta,
    rawFee,
  });

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className={styles.settingsBlockWrapper}>
          <div className={styles.settingsBlock}>
            <div className={styles.settingsBlockCardWrapper}>
              <Card className={styles.settingsBlockCard}>
                <Form form={formPrice} initialValues={initialValuesPrice}>
                  <h2 className={styles.settingsBlockTitle}>pricing</h2>
                  {pairType === PairType.LiquidityProvision && (
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
                  </h3>
                  <Form.Item name="spotPrice">
                    <InputNumber
                      min={
                        pairType !== PairType.TokenForNFT
                          ? chosenMarket?.bestoffer === '0.000'
                            ? 0
                            : chosenMarket?.bestoffer
                          : 0
                      }
                      max={
                        pairType !== PairType.NftForToken
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
                  </h3>
                  <PairButtons
                    className={styles.pairButtonsWrapper}
                    onClickLeft={() => setCurveType(BondingCurveType.Linear)}
                    onClickRight={() =>
                      setCurveType(BondingCurveType.Exponential)
                    }
                    valueButtonLeft="linear curve"
                    valueButtonRight="exponential curve"
                    isActiveLeft={curveType === BondingCurveType.Linear}
                    isActiveRight={curveType === BondingCurveType.Exponential}
                  />
                  <h3 className={styles.settingsBlockSubTitle}>delta</h3>
                  <Form.Item name="delta">
                    <InputNumber addonAfter={deltaType} min="0" />
                  </Form.Item>
                </Form>
                {pairType !== PairType.NftForToken && (
                  <p className={styles.settingsBlockText}>
                    starting buying price {spotPrice} SOL
                  </p>
                )}
                {pairType !== PairType.TokenForNFT && (
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
                )}
              </Card>
            </div>
            <div className={styles.settingsBlockCardWrapper}>
              <Card className={styles.settingsBlockCard}>
                <Form form={formAssets} initialValues={initialValuesAssets}>
                  <h2>assets</h2>
                  {pairType === PairType.TokenForNFT && (
                    <>
                      <h3 className={styles.settingsBlockSubTitle}>
                        amount of NFTs
                      </h3>
                      <Form.Item name="nftAmount">
                        <InputNumber min="0" addonAfter="NFTs" />
                      </Form.Item>
                    </>
                  )}
                  {pairType === PairType.NftForToken && (
                    <div>
                      {nftModal.selectedNfts?.map((nft) => (
                        <NFTCard
                          key={nft.mint}
                          imageUrl={nft.imageUrl}
                          simpleCard
                        />
                      ))}
                    </div>
                  )}
                  {pairType === PairType.LiquidityProvision && (
                    <div>
                      {nftModal.selectedNfts?.map((nft) => (
                        <NFTCard
                          key={nft.mint}
                          imageUrl={nft.imageUrl}
                          simpleCard
                        />
                      ))}
                    </div>
                  )}
                </Form>
              </Card>
              <div className={styles.createPoolButtonWrapper}>
                <Button
                  isDisabled={isCreateButtonDisabled}
                  onClick={onCreatePoolClick}
                >
                  <span>create pool</span>
                </Button>
              </div>
            </div>
          </div>
          <div className={styles.chartWrapper}>
            <ChartLine
              create
              baseSpotPrice={spotPrice * 1e9}
              delta={rawDelta}
              fee={fee}
              type={pairType}
              bondingCurve={curveType}
              buyOrdersAmount={nftAmount}
              nftsCount={nftModal?.selectedNfts?.length}
            />
          </div>
          <SelectNftsModal
            {...nftModal}
            collectionName={chosenMarket?.collectionName}
          />
        </div>
      )}
    </>
  );
};
