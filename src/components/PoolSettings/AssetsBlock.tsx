import { forwardRef } from 'react';
import { Card } from '../Card';
import classNames from 'classnames';
import { PairType } from 'hadeswap-sdk/lib/hadeswap-core/types';
import { BigPlusIcon } from '../../icons/BigPlusIcon';
import { MinusIcon } from '../../icons/MinusIcon';
import { Form, FormInstance, InputNumber } from 'antd';
import { Pair } from '../../state/core/types';
import { NftsBlock } from './NftsBlock';
import { NftWithSelect } from './hooks/usePoolServiceAssets';

import styles from './styles.module.scss';

interface AssetsBlockProps {
  editMode?: boolean;
  pairType: PairType;
  nfts: NftWithSelect[];
  selectedNfts: NftWithSelect[];
  toggleNft: (mint: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  form: FormInstance;
  formInitialValues: {
    nftAmount: number;
    buyOrdersAmount?: number;
  };
  buyOrdersAmount?: number;
  pool?: Pair;
}

export const AssetsBlock = forwardRef<HTMLDivElement, AssetsBlockProps>(
  (
    {
      editMode = false,
      nfts,
      toggleNft,
      selectedNfts,
      selectAll,
      deselectAll,
      pairType,
      form,
      formInitialValues,
      buyOrdersAmount,
      pool,
    },
    ref,
  ) => {
    const isSelectedButtonDisabled = buyOrdersAmount < pool?.buyOrdersAmount;

    return (
      <div ref={ref} className={styles.assetsBlockWrapper}>
        <Card
          className={classNames(styles.card, {
            [styles.height100]: pairType !== PairType.TokenForNFT,
          })}
        >
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>assets</h2>
            {pairType !== PairType.TokenForNFT && (
              <button
                className={styles.selectButton}
                onClick={selectedNfts.length ? deselectAll : selectAll}
              >
                {!selectedNfts.length && (
                  <span>
                    <BigPlusIcon />
                    select all
                  </span>
                )}
                {!!selectedNfts.length && (
                  <span>
                    <MinusIcon />
                    deselect all
                  </span>
                )}
              </button>
            )}
          </div>
          {pairType === PairType.TokenForNFT && (
            <>
              <h3 className={styles.cardSubTitle}>amount of NFTs</h3>
              <Form form={form} initialValues={formInitialValues}>
                <Form.Item name="nftAmount">
                  <InputNumber min="0" addonAfter="NFTs" />
                </Form.Item>
              </Form>
            </>
          )}
          {pairType === PairType.NftForToken && (
            <NftsBlock nfts={nfts} toggleNft={toggleNft} />
          )}
          {pairType === PairType.LiquidityProvision && (
            <>
              {editMode && (
                <>
                  <h3 className={styles.cardSubTitle}>buy orders amount</h3>
                  <Form form={form} initialValues={formInitialValues}>
                    <Form.Item name="buyOrdersAmount">
                      <InputNumber
                        disabled={Boolean(selectedNfts.length)}
                        max={
                          isSelectedButtonDisabled
                            ? pool?.buyOrdersAmount
                            : buyOrdersAmount
                        }
                        min={0}
                        step={2}
                        addonAfter="NFTs"
                      />
                    </Form.Item>
                  </Form>
                </>
              )}
              <NftsBlock nfts={nfts} toggleNft={toggleNft} />
            </>
          )}
        </Card>
      </div>
    );
  },
);

AssetsBlock.displayName = 'AssetsBlock';
