import React, { forwardRef } from 'react';
import { Card } from '../Card';
import { Form, InputNumber, Tooltip, FormInstance } from 'antd';
import {
  BondingCurveType,
  OrderType,
  PairType,
} from 'hadeswap-sdk/lib/hadeswap-core/types';
import { InfoCircleOutlined } from '@ant-design/icons';
import { PairButtons } from '../Buttons/PairButtons';
import { helpers } from 'hadeswap-sdk/lib/hadeswap-core';
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
      formInitialValues,
      pool,
    },
    ref,
  ) => {
    const deltaType = curveType === BondingCurveType.Exponential ? '%' : 'SOL';
    const isDisableFields =
      !(pairType === PairType.NftForToken) && pool?.buyOrdersAmount > 20;

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
                onClickRight={() => setCurveType(BondingCurveType.Exponential)}
                valueButtonLeft="linear curve"
                valueButtonRight="exponential curve"
                isActiveLeft={curveType === BondingCurveType.Linear}
                isActiveRight={curveType === BondingCurveType.Exponential}
              />
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
            </Form>
            <div className={styles.priceCardNotice}>
              {pairType !== PairType.NftForToken && (
                <div className={styles.noticeRow}>
                  <span className={styles.noticeTitle}>
                    starting buying price
                  </span>
                  <span className={styles.noticeValue}>{spotPrice} SOL</span>
                </div>
              )}
              {pairType !== PairType.TokenForNFT && (
                <div className={styles.noticeRow}>
                  <span className={styles.noticeTitle}>
                    starting selling price
                  </span>
                  <span className={styles.noticeValue}>
                    {helpers.calculateNextSpotPrice({
                      orderType: OrderType.Buy,
                      delta: delta,
                      spotPrice: spotPrice,
                      bondingCurveType: curveType,
                      counter: 0,
                    })}{' '}
                    SOL
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