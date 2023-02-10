import React, { FC, useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Spinner } from '../../components/Spinner/Spinner';
import { AppLayout } from '../../components/Layout/AppLayout';
import PageContentLayout from '../../components/Layout/PageContentLayout';
import { Search } from '../../components/Search';
import { useSearch } from '../../components/Search/useSearch';
import ItemsList from '../../components/ItemsList';
import Sorting from '../../components/Sorting/mobile/Sorting';
import { OpenSortButton } from '../../components/Sorting/mobile/OpenSortButton';
import { sortCollection } from '../../components/Sorting/mobile/helpers';
import { COLLECTION_COLUMNS } from '../../utils/table/constants';
import { SORT_ORDER, COLLECTION } from '../../constants/common';
import { PubKeys } from '../../types';
import { filterCollections } from './helpers';
import { useFetchAllMarkets } from '../../requests';

import { selectScreeMode } from '../../state/common/selectors';
import {
  selectAllMarkets,
  selectAllMarketsLoading,
} from '../../state/core/selectors';
import { ScreenTypes } from '../../state/common/types';
import { createCollectionLink } from '../../constants';

import styles from './Collections.module.scss';

export const Collections: FC = () => {
  const INITIAL_SORT_VALUE = 'offerTVL';
  const history = useHistory();

  const [sortValue, setSortValue] = useState<string>(
    `${INITIAL_SORT_VALUE}_${SORT_ORDER.DESC}`,
  );
  const [collections, setCollections] = useState([]);
  const [showList, setShowList] = useState<boolean>(false);
  const [isSortingVisible, setIsSortingVisible] = useState<boolean>(false);

  const screenMode = useSelector(selectScreeMode);
  const isMobile = screenMode !== ScreenTypes.DESKTOP;

  const { searchStr, handleSearch } = useSearch();

  const onRowClick = useCallback(
    (data: string): void => {
      history.push(createCollectionLink(data));
      window.scrollTo(0, 0);
    },
    [history],
  );

  useFetchAllMarkets();

  const markets = useSelector(selectAllMarkets);
  const isLoading = useSelector(selectAllMarketsLoading);

  useEffect(() => {
    const filteredCollections = filterCollections([...markets], searchStr);
    if (sortValue) {
      const [name, order] = sortValue.split('_');
      setCollections(sortCollection(filteredCollections, name, order));
    } else {
      setCollections(filteredCollections);
    }
    markets.length && setShowList(true);
  }, [searchStr, markets, sortValue]);

  return (
    <AppLayout>
      <PageContentLayout title="collections" isLoading={isLoading}>
        {!showList ? (
          <Spinner />
        ) : (
          <>
            <div className={styles.controlsWrapper}>
              <Search onChange={handleSearch} />
              {isMobile && (
                <OpenSortButton setIsSortingVisible={setIsSortingVisible} />
              )}
            </div>
            <ItemsList
              idKey="collectionName"
              onRowClick={onRowClick}
              data={collections}
              mapType={COLLECTION}
              pubKey={PubKeys.MARKET_PUBKEY}
            />
          </>
        )}
        {isMobile && isSortingVisible && (
          <Sorting
            setIsSortingVisible={setIsSortingVisible}
            sortValue={sortValue}
            setSortValue={setSortValue}
            data={COLLECTION_COLUMNS}
          />
        )}
      </PageContentLayout>
    </AppLayout>
  );
};
