import React, { forwardRef } from 'react';
import { Card } from '../Card';
import { Form, FormInstance, InputNumber, Tooltip } from 'antd';
import {
  BondingCurveType,
  PairType,
} from 'hadeswap-sdk/lib/hadeswap-core/types';
import { InfoCircleOutlined } from '@ant-design/icons';
import { PairButtons } from '../Buttons/PairButtons';
import {
  priceLockedIntoPool,
  startingBuyingPrice,
  startingSellingPrice,
} from './utils';
import { MarketInfo, Pair } from '../../state/core/types';

import styles from './styles.module.scss';
import { renamePairType } from '../../state/core/helpers';

interface PriceBlockProps {
  editMode?: boolean;
  form: FormInstance;
  pairType: PairType;
  chosenMarket: MarketInfo;
  curveType: BondingCurveType;
  setCurveType: React.Dispatch<BondingCurveType>;
  spotPrice: number;
  delta: number;
  fee: number;
  buyOrdersAmount: number;
  nftsCount: number;
  formInitialValues: {
    fee: number;
    spotPrice: number;
    delta: number;
  };
  pool?: Pair;
}

export const PriceBlock = forwardRef<HTMLDivElement, PriceBlockProps>(
  (
    {
      editMode = false,
      form,
      pairType,
      chosenMarket,
      curveType,
      setCurveType,
      spotPrice,
      delta,
      fee,
      buyOrdersAmount,
      nftsCount,
      formInitialValues,
      pool,
    },
    ref,
  ) => {
    const calcDeltaType = () => {
      if (curveType === BondingCurveType.Exponential) return '%';
      if (curveType === BondingCurveType.Linear) return 'SOL';
      return '';
    };
    const deltaType = calcDeltaType();

    const isDisableFields =
      !(pairType === PairType.NftForToken) && pool?.buyOrdersAmount > 20;

    const buyingPrice = startingBuyingPrice({
      pairType,
      fee,
      spotPrice,
      nftsCount,
      curveType,
      mathCounter: pool?.mathCounter,
    });

    const sellingPrice = startingSellingPrice({
      pairType,
      curveType,
      fee,
      spotPrice,
      delta,
      nftsCount,
      mathCounter: pool?.mathCounter,
    });

    const priceIntoPool = priceLockedIntoPool({
      pairType,
      spotPrice,
      delta,
      buyOrdersAmount,
      nftsCount,
      curveType,
      mathCounter: pool?.mathCounter,
    });

    const spotPriceFieldName =
      curveType === BondingCurveType.XYK ? 'pool size' : 'spot price';

    return (
      <div className={styles.priceBlockWrapper}>
        <div ref={ref}>
          <Card className={styles.card}>
            {editMode && isDisableFields && (
              <p className={styles.h2}>
                you can edit &quot;spot price&quot; and &quot;delta&quot; only
                if you have less than 20 buy orders
              </p>
            )}
            <h2 className={styles.cardTitle}>pricing</h2>
            <Form form={form} initialValues={formInitialValues}>
              {pairType === PairType.LiquidityProvision && (
                <>
                  <h3 className={styles.cardSubTitle}>fee</h3>
                  <Form.Item name="fee">
                    <InputNumber min={0} max={99.5} addonAfter="%" />
                  </Form.Item>
                </>
              )}
              <h3 className={styles.cardSubTitle}>
                {`${spotPriceFieldName} ${
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
                  disabled={editMode && isDisableFields}
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
              <h3 className={styles.cardSubTitle}>
                bonding curve
                <Tooltip
                  placement="top"
                  title="controls how your pool\'s price will change"
                >
                  <InfoCircleOutlined />
                </Tooltip>
              </h3>
              <PairButtons
                isDisabled={editMode}
                className={styles.pairButtonsWrapper}
                onClickLeft={() => setCurveType(BondingCurveType.Linear)}
                onClickCenter={() => setCurveType(BondingCurveType.Exponential)}
                onClickRight={() => setCurveType(BondingCurveType.XYK)}
                valueButtonLeft="linear curve"
                valueButtonCenter="exponential curve"
                valueButtonRight="xyk"
                isActiveLeft={curveType === BondingCurveType.Linear}
                isActiveCenter={curveType === BondingCurveType.Exponential}
                isActiveRight={curveType === BondingCurveType.XYK}
              />
              {curveType === BondingCurveType.XYK ? (
                <>
                  <h3 className={styles.cardSubTitle}>nfts amount</h3>
                  <InputNumber disabled value={nftsCount} addonAfter="NFTs" />
                </>
              ) : (
                <>
                  <h3 className={styles.cardSubTitle}>
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
                      disabled={editMode && isDisableFields}
                      addonAfter={deltaType}
                      min="0"
                    />
                  </Form.Item>
                </>
              )}
            </Form>
            <div className={styles.priceCardNotice}>
              {pairType !== PairType.NftForToken && (
                <div className={styles.noticeRow}>
                  <span className={styles.noticeTitle}>
                    starting buying price
                  </span>
                  <span className={styles.noticeValue}>
                    {buyingPrice?.toFixed(3)} SOL
                  </span>
                </div>
              )}
              {pairType !== PairType.TokenForNFT && (
                <div className={styles.noticeRow}>
                  <span className={styles.noticeTitle}>
                    starting selling price
                  </span>
                  <span className={styles.noticeValue}>
                    {sellingPrice?.toFixed(3)} SOL
                  </span>
                </div>
              )}
              {pairType !== PairType.NftForToken && (
                <div className={styles.noticeRow}>
                  <span className={styles.noticeTitle}>
                    to be locked into pool
                  </span>
                  <span className={styles.noticeValue}>
                    {priceIntoPool?.toFixed(3)} SOL
                  </span>
                </div>
              )}
              {editMode && !!delta && (
                <p className={styles.noticeText}>
                  each time your pool {renamePairType(pairType)}s an NFT, your{' '}
                  {renamePairType(pairType)} price will adjust up by {delta}{' '}
                  {deltaType}
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  },
);

PriceBlock.displayName = 'PriceBlock';
