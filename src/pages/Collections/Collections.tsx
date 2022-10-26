import React, { FC, useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Typography, Row, Col, Button, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import { AppLayout } from '../../components/Layout/AppLayout';
import { Spinner } from '../../components/Spinner/Spinner';
import CollectionList from "./components/CollectionsList";
import SortingModal from './mobile/SortingModal';
import { INITIAL_SORT_VALUE } from './Collections.constants';
import { SORT_ORDER } from '../../constants/common';
import { sortCollection, filterCollections } from './helpers';

import { coreActions } from '../../state/core/actions';
import {
  selectAllMarkets,
  selectAllMarketsLoading,
} from '../../state/core/selectors';
import { selectScreeMode } from '../../state/common/selectors';
import { ScreenTypes } from '../../state/common/types';
import { MarketInfo } from '../../state/core/types';
import { useDebounce } from '../../hooks';
import { COLLECTION_TABS, createCollectionLink } from '../../constants';
import styles from './Collections.module.scss';

const { Title } = Typography;

export const Collections: FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [searchStr, setSearchStr] = useState<string>('');
  const [sortValue, setSortValue] = useState<string>(
    `${INITIAL_SORT_VALUE}_${SORT_ORDER.DESC}`,
  );
  const [collections, setCollections] = useState<MarketInfo[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const screenMode = useSelector(selectScreeMode);
  const markets = useSelector(selectAllMarkets);
  const collectionsLoading = useSelector(selectAllMarketsLoading);

  const isMobile = screenMode === ScreenTypes.TABLET;

  const setSearch = useDebounce((search: string): void => {
    setSearchStr(search.toUpperCase());
  }, 300);

  const onRowClick = useCallback((data: string): void => {
    history.push(createCollectionLink(COLLECTION_TABS.BUY, data));
    window.scrollTo(0, 0);
  }, [history]);

  const handleSort = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (sortValue !== e.currentTarget.dataset.value) {
        setSortValue(e.currentTarget.dataset.value);
      } else {
        setSortValue('');
      }
    },
    [sortValue],
  );

  useEffect(() => {
    dispatch(coreActions.fetchAllMarkets());
  }, [dispatch]);

  useEffect(() => {
    const collection = filterCollections(markets.slice(), searchStr);
    if (sortValue) {
      const [name, order] = sortValue.split('_');
      setCollections(sortCollection(collection, name, order));
    } else {
      setCollections(collection);
    }
  }, [searchStr, markets, sortValue]);

  return (
    <AppLayout>
      {isMobile && isModalVisible && (
        <SortingModal
          setIsModalVisible={setIsModalVisible}
          handleSort={handleSort}
          sortValue={sortValue}
        />
      )}
      <Row justify="center">
        <Col>
          <Title>collections</Title>
        </Col>
      </Row>
      {collectionsLoading ? (
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
                    <div
                      className={styles.sortingBtn}
                      onClick={() => setIsModalVisible(true)}
                    >
                      sorting
                    </div>
                  )}
                </div>
                <CollectionList
                  onRowClick={onRowClick}
                  data={collections}
                />
              </div>
            </Col>
          </Row>
        </>
      )}
    </AppLayout>
  );
};
