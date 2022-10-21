import React, { FC, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../Spinner/Spinner';
import { PriceWithIcon } from '../../pages/Collections/components/PriceWithIcon';
import { coreActions } from '../../state/core/actions';
import {
  selectAllMarkets,
  selectAllMarketsLoading,
} from '../../state/core/selectors';
import { MarketInfo } from '../../state/core/types';
import { COLLECTION_TABS, createCollectionLink } from '../../constants';
import { Avatar, Typography } from 'antd';
import ArrowIcon from '../../icons/ArrowIcon';
import styles from './TopMarkets.module.scss';

const TopMarkets: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const collectionsLoading = useSelector(selectAllMarketsLoading) as boolean;
  const markets = useSelector(selectAllMarkets) as MarketInfo[];
  const [collections, setCollections] = useState<MarketInfo[]>([]);

  const handleClick = useCallback(
    (marketPubkey: string) => (): void => {
      history.push(createCollectionLink(COLLECTION_TABS.BUY, marketPubkey));
      window.scrollTo(0, 0);
    },
    [history],
  );

  useEffect(() => {
    dispatch(coreActions.fetchAllMarkets());
  }, []);

  useEffect(() => {
    setCollections(
      [...markets]
        .sort((a, b) => (+b.offerTVL > +a.offerTVL ? 1 : -1))
        .slice(0, 20),
    );
  }, [markets]);

  return (
    <div className={styles.wrapper}>
      <Typography.Title level={3} className={styles.title}>
        &#128293; Top 20 markets by daily trading volume
      </Typography.Title>

      {collectionsLoading ? (
        <Spinner />
      ) : (
        <ol className={styles.list}>
          <>
            {collections.map((item, idx) => (
              <li className={styles.item} key={item.marketPubkey}>
                <div className={styles.itemNumber}>{idx + 1}</div>
                <Avatar size={34} src={item.collectionImage} />

                <div className={styles.description}>
                  <div className={styles.poolName}>{item.collectionName}</div>
                  <div className={styles.offerTVL}>
                    <span className={styles.offerLabel}>offer TVL: &nbsp;</span>
                    <PriceWithIcon price={item.offerTVL} rightIcon />
                  </div>
                </div>

                <button
                  className={styles.btn}
                  onClick={handleClick(item.marketPubkey)}
                >
                  <ArrowIcon width={18} height={16} />
                  <span>trade</span>
                </button>
              </li>
            ))}
          </>
        </ol>
      )}
    </div>
  );
};

export default TopMarkets;
