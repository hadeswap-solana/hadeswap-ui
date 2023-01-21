import { forwardRef, MutableRefObject } from 'react';
import { Card } from '../Card';
import { InputNumber, Tooltip } from 'antd';
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
import { deriveXykBaseSpotPriceFromCurrentSpotPrice } from 'hadeswap-sdk/lib/hadeswap-core/helpers';
import { FormValuePriceBlock } from './hooks/usePoolServicePrice';

interface PriceBlockProps {
  pool?: Pair;
  ref: MutableRefObject<HTMLDivElement>;
  editMode?: boolean;
  formValue: FormValuePriceBlock;
  setFormValue: (prev: any) => void;
  pairType: PairType;
  chosenMarket: MarketInfo;
  buyOrdersAmount: number;
  nftsCount: number;
  rawDelta: number;
}

export const PriceBlock = forwardRef<HTMLDivElement, PriceBlockProps>(
  (
    {
      formValue,
      setFormValue,
      editMode = false,
      pairType,
      chosenMarket,
      buyOrdersAmount = 0,
      nftsCount = 0,
      pool,
      rawDelta,
    },
    ref,
  ) => {
    const deltaType =
      formValue.curveType === BondingCurveType.Exponential ? '%' : 'SOL';

    const isDisableFields =
      !(pairType === PairType.NftForToken) && pool?.buyOrdersAmount > 15;

    const parsedSpotPrice =
      formValue.curveType === BondingCurveType.XYK
        ? deriveXykBaseSpotPriceFromCurrentSpotPrice({
            currentSpotPrice: formValue.spotPrice,
            counter: pool?.mathCounter || 0,
            delta: rawDelta,
          })
        : formValue.spotPrice;

    const buyingPrice = startingBuyingPrice({
      pairType,
      fee: formValue.fee,
      spotPrice: formValue.spotPrice,
    });

    const sellingPrice = startingSellingPrice({
      pairType,
      curveType: formValue.curveType,
      fee: formValue.fee,
      spotPrice: parsedSpotPrice,
      delta: rawDelta,
      mathCounter: pool?.mathCounter,
    });

    const priceIntoPool = priceLockedIntoPool({
      pairType,
      spotPrice: parsedSpotPrice,
      delta: rawDelta,
      buyOrdersAmount,
      nftsCount,
      curveType: formValue.curveType,
      mathCounter: pool?.mathCounter,
    });

    const isWarningVisible =
      parseFloat(chosenMarket?.floorPrice) > sellingPrice &&
      !!formValue.spotPrice &&
      pairType !== PairType.TokenForNFT;

    return (
      <div className={styles.priceBlockWrapper}>
        <div ref={ref}>
          <Card className={styles.card}>
            <h2 className={styles.cardTitle}>pricing</h2>
            {pairType === PairType.LiquidityProvision && (
              <>
                <h3 className={styles.cardSubTitle}>fee</h3>
                <InputNumber
                  // type="number"
                  min={0}
                  max={99.5}
                  addonAfter="%"
                  disabled={editMode && isDisableFields}
                  defaultValue={formValue.fee}
                  onChange={(values) =>
                    setFormValue((prev) => ({
                      ...prev,
                      fee: values ? values : 0,
                    }))
                  }
                />
              </>
            )}
            <h3 className={styles.cardSubTitle}>
              {`spot price ${
                chosenMarket
                  ? `(current best offer: ${chosenMarket?.bestoffer} SOL, current floor price: ${chosenMarket?.floorPrice} SOL)`
                  : ''
              }`}
              <Tooltip placement="top" title="the starting price of your pool">
                <InfoCircleOutlined />
              </Tooltip>
            </h3>

            <InputNumber
              // type="number"
              min={0}
              addonAfter="SOL"
              disabled={editMode && isDisableFields}
              defaultValue={formValue.spotPrice}
              onChange={(values) =>
                setFormValue((prev) => ({
                  ...prev,
                  spotPrice: values ? values : 0,
                }))
              }
            />

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
              formValue={formValue}
              setFormValue={setFormValue}
            />

            {formValue.curveType !== BondingCurveType.XYK && (
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
                <InputNumber
                  // type="number"
                  min={0}
                  disabled={editMode && isDisableFields}
                  addonAfter={deltaType}
                  defaultValue={formValue.delta}
                  onChange={(values) =>
                    setFormValue((prev) => ({
                      ...prev,
                      delta: values ? values : 0,
                    }))
                  }
                />
              </>
            )}

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
              {editMode && formValue.curveType !== BondingCurveType.XYK && (
                <p className={styles.noticeText}>
                  each time your pool {renamePairType(pairType)}s an NFT, your{' '}
                  {renamePairType(pairType)} price will adjust up by{' '}
                  {formValue.delta} {deltaType}
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
