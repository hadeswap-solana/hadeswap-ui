import { FC, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Form, InputNumber } from 'antd';
import {
  BondingCurveType,
  PairType,
} from 'hadeswap-sdk/lib/hadeswap-core/types';

import { selectAllMarketsLoading } from '../../../state/core/selectors';
import { usePoolServiceAssets } from '../../PoolSettings/hooks/usePoolServiceAssets';
import { useCreatePool } from '../../../pages/CreatePool/hooks';
import { AssetsBlock } from '../../PoolSettings/AssetsBlock';
import { Spinner } from '../../Spinner/Spinner';
import styles from './SellTab.module.scss';
import Button from '../../Buttons/Button';

const SellTab: FC<{ onCancel: () => void }> = ({ onCancel }) => {
  const { publicKey: marketPublicKey } = useParams<{ publicKey: string }>();
  const marketsLoading = useSelector(selectAllMarketsLoading);
  const { connected } = useWallet();

  const {
    nfts,
    nftAmount,
    selectedNfts,
    toggleNft,
    selectAll,
    deselectAll,
    formAssets,
    nftsLoading,
  } = usePoolServiceAssets({ marketPublicKey });

  const isLoading = nftsLoading || marketsLoading;

  const [formPrice] = Form.useForm();
  const priceValue: number = Form.useWatch('price', formPrice);

  const rawSpotPrice = priceValue * 1e9;

  const { create: onCreatePoolClick } = useCreatePool({
    pairType: PairType.NftForToken,
    nftsAmount: nftAmount,
    marketPubkey: marketPublicKey,
    selectedNfts,
    curveType: BondingCurveType.Linear,
    rawSpotPrice,
    rawDelta: 0,
    rawFee: 0,
    onAfterTxn: onCancel,
  });

  const assetsBlockRef = useRef<HTMLDivElement>();
  const initialValuesAssets = { nftAmount: 0 };
  const initialValuesPrice = { price: 0 };

  return (
    <>
      {!connected ? (
        <h2 className={styles.notConnectWallet}>connect your wallet</h2>
      ) : isLoading ? (
        <Spinner />
      ) : (
        <>
          <AssetsBlock
            ref={assetsBlockRef}
            nfts={nfts}
            toggleNft={toggleNft}
            selectedNfts={selectedNfts}
            pairType={PairType.NftForToken}
            form={formAssets}
            selectAll={selectAll}
            deselectAll={deselectAll}
            formInitialValues={initialValuesAssets}
            className={styles.card}
          />
          <div>
            <h3 className={styles.cardSubTitle}>price</h3>
            <Form form={formPrice} initialValues={initialValuesPrice}>
              <Form.Item name="price">
                <InputNumber min="0" addonAfter="SOL" />
              </Form.Item>
            </Form>
          </div>
          <div className={styles.noticeRow}>
            <span className={styles.noticeTitle}>total</span>
            <span className={styles.noticeValue}>
              {selectedNfts?.length} NFT
            </span>
          </div>
          <p className={styles.noticeText}>
            your NFTs will be escrowed into your pool. you can withdraw at any
            time by going to my pools
          </p>
          <Button
            isDisabled={!priceValue}
            onClick={onCreatePoolClick}
            className={styles.offerBtn}
          >
            <span>direct listing</span>
          </Button>
        </>
      )}
    </>
  );
};

export default SellTab;
