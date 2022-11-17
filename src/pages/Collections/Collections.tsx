import React, { FC, useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Typography, Row, Col, Button, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import { AppLayout } from '../../components/Layout/AppLayout';
import { Spinner } from '../../components/Spinner/Spinner';
import CollectionList from '../../components/CollectionsList';
import Sorting from '../../components/Sorting/mobile/Sorting';
import { OpenSortButton } from '../../components/Sorting/mobile/OpenSortButton';
import { sortCollection } from '../../components/Sorting/mobile/helpers';
import { COLLECTION_COLUMNS } from '../../utils/table/constants';
import { SORT_ORDER } from '../../constants/common';
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

const { Title } = Typography;

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
  const isMobile = screenMode === ScreenTypes.TABLET;

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
      {isMobile && isSortingVisible && (
        <Sorting
          setIsSortingVisible={setIsSortingVisible}
          sortValue={sortValue}
          setSortValue={setSortValue}
          data={COLLECTION_COLUMNS}
        />
      )}
      <Row justify="center">
        <Col>
          <Title>collections</Title>
        </Col>
      </Row>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <Row justify="center">
            <Col>
              <Button
                style={{ marginBottom: '20px' }}
                type="primary"
                size="large"
                onClick={() => {
                  history.push('/create-pool');
                }}
              >
                + create pool
              </Button>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <div className={styles.tableWrapper}>
                <div className={styles.controlsWrapper}>
                  <Input
                    size="large"
                    placeholder="search by collection name"
                    prefix={<SearchOutlined />}
                    className={styles.searchInput}
                    onChange={(event) => setSearch(event.target.value || '')}
                  />
                  {isMobile && (
                    <OpenSortButton setIsSortingVisible={setIsSortingVisible} />
                  )}
                </div>
                <CollectionList onRowClick={onRowClick} data={collections} />
              </div>
            </Col>
          </Row>
        </>
      )}
    </AppLayout>
  );
};
