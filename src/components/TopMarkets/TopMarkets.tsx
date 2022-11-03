import { FC, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Spinner } from '../Spinner/Spinner';
import { PriceWithIcon } from '../../pages/Collections/components/PriceWithIcon';

import { COLLECTION_TABS, createCollectionLink } from '../../constants';
import { Avatar, Typography } from 'antd';
import ArrowIcon from '../../icons/ArrowIcon';
import styles from './TopMarkets.module.scss';

export interface IMarket {
  collectionImage: string;
  collectionName: string;
  collectionPublicKey: string;
  volume24: number;
}

interface TopMarketsProps {
  data: IMarket[];
  isLoading: boolean;
}

const TopMarkets: FC<TopMarketsProps> = ({ data, isLoading }) => {
  const history = useHistory();

  const handleClick = useCallback(
    (marketPubkey: string) => (): void => {
      history.push(createCollectionLink(COLLECTION_TABS.BUY, marketPubkey));
      window.scrollTo(0, 0);
    },
    [history],
  );

  return (
    <div className={styles.wrapper}>
      <Typography.Title level={3} className={styles.title}>
        &#128293; Top 20 markets by daily trading volume
      </Typography.Title>

      {isLoading ? (
        <Spinner />
      ) : (
        <ol className={styles.list}>
          {data?.map((item, idx) => (
            <li className={styles.item} key={item.collectionPublicKey + idx}>
              <div className={styles.itemNumber}>{idx + 1}</div>
              <Avatar size={34} src={item.collectionImage} />

              <div className={styles.description}>
                <div className={styles.poolName}>{item.collectionName}</div>
                <div className={styles.offerTVL}>
                  <span className={styles.offerLabel}>offer TVL: &nbsp;</span>
                  <PriceWithIcon
                    price={(item.volume24 / 1e9).toString()}
                    rightIcon
                  />
                </div>
              </div>

              <button
                className={styles.btn}
                onClick={handleClick(item.collectionPublicKey)}
              >
                <ArrowIcon width={18} height={16} />
                <span>trade</span>
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default TopMarkets;
