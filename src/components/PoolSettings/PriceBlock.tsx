import React, { forwardRef } from 'react';
import { Card } from '../Card';
import { Form, FormInstance, InputNumber, Tooltip } from 'antd';
import {
  BondingCurveType,
  PairType,
} from 'hadeswap-sdk/lib/hadeswap-core/types';
import BondingCurveButtons from '../Buttons/BondingCurveButtons/BondingCurveButtons';

import { InfoCircleOutlined } from '@ant-design/icons';
import {
  startingBuyingPrice,
  startingSellingPrice,
  priceLockedIntoPool,
} from './utils';
import { MarketInfo, Pair } from '../../state/core/types';
import { renamePairType } from '../../state/core/helpers';
import { NotifyInfoIcon } from '../../icons/NotifyInfoIcon';

import styles from './styles.module.scss';

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
      fee = 0,
      buyOrdersAmount = 0,
      nftsCount = 0,
      formInitialValues,
      pool,
    },
    ref,
  ) => {
    const deltaType = curveType === BondingCurveType.Exponential ? '%' : 'SOL';
    const isDisableFields =
      !(pairType === PairType.NftForToken) && pool?.buyOrdersAmount > 15;

    const deltaParsed =
      curveType === BondingCurveType.XYK
        ? Math.ceil(
            (buyOrdersAmount + nftsCount) /
              (pairType === PairType.LiquidityProvision ? 2 : 1),
          )
        : delta;

    const buyingPrice = startingBuyingPrice({ pairType, fee, spotPrice });
    const sellingPrice = startingSellingPrice({
      pairType,
      curveType,
      fee,
      spotPrice,
      delta: deltaParsed,
      mathCounter: 0,
    });

    const priceIntoPool = priceLockedIntoPool({
      pairType,
      spotPrice,
      delta: deltaParsed,
      buyOrdersAmount,
      nftsCount,
      curveType,
      mathCounter: pool?.mathCounter,
    });

    const isWarningVisible =
      parseFloat(chosenMarket?.floorPrice) > sellingPrice &&
      !!spotPrice &&
      pairType !== PairType.TokenForNFT;

    return (
      <div className={styles.priceBlockWrapper}>
        <div ref={ref}>
          <Card className={styles.card}>
            <h2 className={styles.cardTitle}>pricing</h2>
            <Form form={form} initialValues={formInitialValues}>
              {pairType === PairType.LiquidityProvision && (
                <>
                  <h3 className={styles.cardSubTitle}>fee</h3>
                  <Form.Item name="fee">
                    <InputNumber
                      // defaultValue={0}
                      min={0}
                      max={99.5}
                      addonAfter="%"
                      disabled={editMode && isDisableFields}
                    />
                  </Form.Item>
                </>
              )}
              <h3 className={styles.cardSubTitle}>
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
                  disabled={editMode && isDisableFields}
                  defaultValue={pool?.baseSpotPrice}
                  // min={
                  //   pairType !== PairType.TokenForNFT
                  //     ? chosenMarket?.bestoffer === '0.000'
                  //       ? 0
                  //       : chosenMarket?.bestoffer
                  //     : 0
                  // }
                  // max={
                  //   pairType !== PairType.NftForToken
                  //     ? chosenMarket?.floorPrice === '0.000'
                  //       ? 100000000
                  //       : chosenMarket?.floorPrice
                  //     : 100000000
                  // }
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
              <BondingCurveButtons
                isDisabled={editMode}
                curveType={curveType}
                setCurveType={setCurveType}
              />

              {curveType !== BondingCurveType.XYK && (
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
              {!!isWarningVisible && (
                <div className={styles.notify}>
                  <NotifyInfoIcon />
                  make sure you are going to list your items for{' '}
                  {sellingPrice?.toFixed(3)} SOL which is below floor of{' '}
                  {chosenMarket?.floorPrice} SOL
                </div>
              )}
              {editMode && !!delta && (
                <p className={styles.noticeText}>
                  each time your pool {renamePairType(pairType)}s an NFT, your{' '}
                  {renamePairType(pairType)} price will adjust up by {delta}{' '}
                  {deltaType}
                </p>
              )}
              {editMode && isDisableFields && (
                <p className={styles.noticeText}>
                  {`you can edit "spot price", "delta" and "fee" only if you have less than 15 buy orders`}
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
