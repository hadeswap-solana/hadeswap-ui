import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Form, InputNumber } from 'antd';
import {
  BondingCurveType,
  PairType,
} from 'hadeswap-sdk/lib/hadeswap-core/types';

import { usePoolServiceAssets } from '../../PoolSettings/hooks/usePoolServiceAssets';
import { useCreatePool } from '../../../pages/CreatePool/hooks';
import styles from './BuyTab.module.scss';
import Button from '../../Buttons/Button';

const BuyTab: FC = () => {
  const { publicKey: marketPublicKey } = useParams<{ publicKey: string }>();

  const { selectedNfts, nftAmount, formAssets } = usePoolServiceAssets({
    marketPublicKey,
  });

  const [formPrice] = Form.useForm();
  const priceValue: number = Form.useWatch('price', formPrice);

  const initialValuesAssets = { nftAmount: 0 };
  const initialValuesPrice = { price: 0 };

  const totalValues = priceValue * nftAmount;
  const rawSpotPrice = priceValue * 1e9;

  const { create: onCreatePoolClick } = useCreatePool({
    pairType: PairType.TokenForNFT,
    nftsAmount: nftAmount,
    marketPubkey: marketPublicKey,
    selectedNfts,
    curveType: BondingCurveType.Linear,
    rawSpotPrice,
    rawDelta: 0,
    rawFee: 0,
  });

  return (
    <>
      <div>
        <h3 className={styles.cardSubTitle}>amount of NFTs</h3>
        <Form form={formAssets} initialValues={initialValuesAssets}>
          <Form.Item name="nftAmount">
            <InputNumber min="0" addonAfter="NFTs" />
          </Form.Item>
        </Form>
        <h3 className={styles.cardSubTitle}>price</h3>
        <Form form={formPrice} initialValues={initialValuesPrice}>
          <Form.Item name="price">
            <InputNumber min="0" addonAfter="SOL" />
          </Form.Item>
        </Form>
      </div>
      <div className={styles.notice}>
        <div className={styles.noticeRow}>
          <span className={styles.noticeTitle}>total</span>
          <span className={styles.noticeValue}>
            {totalValues || 0?.toFixed(2)} SOL
          </span>
        </div>
        <p className={styles.noticeText}>
          your tokens will be escrowed into your pool. you can withdraw at any
          time by going to my pools
        </p>
        <Button onClick={onCreatePoolClick} className={styles.offerBtn}>
          <span>create offer</span>
        </Button>
      </div>
    </>
  );
};

export default BuyTab;
