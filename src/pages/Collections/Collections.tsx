import React, { FC, useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import { AppLayout } from '../../components/Layout/AppLayout';
import PageContentLayout from '../../components/Layout/PageContentLayout';
import ItemsList from '../../components/ItemsList';
import Sorting from '../../components/Sorting/mobile/Sorting';
import { OpenSortButton } from '../../components/Sorting/mobile/OpenSortButton';
import { sortCollection } from '../../components/Sorting/mobile/helpers';
import { COLLECTION_COLUMNS } from '../../utils/table/constants';
import { SORT_ORDER, PubKeys, COLLECTION } from '../../constants/common';
import { filterCollections } from './helpers';
import { useFetchAllMarkets } from '../../requests';

import { selectScreeMode } from '../../state/common/selectors';
import {
  selectAllMarkets,
  selectAllMarketsLoading,
} from '../../state/core/selectors';
import { ScreenTypes } from '../../state/common/types';
import { useDebounce } from '../../hooks';
import { createCollectionLink } from '../../constants';

import styles from './Collections.module.scss';

export const Collections: FC = () => {
  const INITIAL_SORT_VALUE = 'offerTVL';

  const history = useHistory();
  const [searchStr, setSearchStr] = useState<string>('');
  const [sortValue, setSortValue] = useState<string>(
    `${INITIAL_SORT_VALUE}_${SORT_ORDER.DESC}`,
  );
  const [collections, setCollections] = useState([]);
  const [isSortingVisible, setIsSortingVisible] = useState<boolean>(false);

  const screenMode = useSelector(selectScreeMode);
  const isMobile = screenMode !== ScreenTypes.DESKTOP;

  const setSearch = useDebounce((search: string): void => {
    setSearchStr(search.toUpperCase());
  }, 300);

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
    const collection = filterCollections([...markets], searchStr);
    if (sortValue) {
      const [name, order] = sortValue.split('_');
      setCollections(sortCollection(collection, name, order));
    } else {
      setCollections(collection);
    }
  }, [searchStr, markets, sortValue]);

  return (
    <AppLayout>
      <PageContentLayout title="collections" isLoading={isLoading}>
        <>
          {isMobile && (
            <div className={styles.controlsWrapper}>
              <Input
                size="large"
                placeholder="search by collection name"
                prefix={<SearchOutlined />}
                onChange={(event) => setSearch(event.target.value || '')}
              />
              <OpenSortButton setIsSortingVisible={setIsSortingVisible} />
            </div>
          )}
          <ItemsList
            onRowClick={onRowClick}
            data={collections}
            mapType={COLLECTION}
            pubKey={PubKeys.MARKET_PUBKEY}
          />
        </>
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
