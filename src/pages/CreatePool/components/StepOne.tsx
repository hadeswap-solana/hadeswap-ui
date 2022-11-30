import React, { FC, useState, useEffect } from 'react';
import { useFetchAllMarkets } from '../../../requests';
import { useSelector } from 'react-redux';
import {
  selectAllMarkets,
  selectAllMarketsLoading,
} from '../../../state/core/selectors';
import { Spinner } from '../../../components/Spinner/Spinner';
import ItemsList from '../../../components/ItemsList';
import { Search } from '../../../components/Search';
import { useSearch } from '../../../components/Search/useSearch';
import { COLLECTION, PubKeys } from '../../../constants/common';
import { filterCollections } from '../../Collections/helpers';
import { MarketInfo } from '../../../state/core/types';

import styles from './styles.module.scss';

interface StepOneProps {
  setStep: (arg: number) => void;
  setChosenMarketKey: (arg: string) => void;
}

export const StepOne: FC<StepOneProps> = ({ setStep, setChosenMarketKey }) => {
  const [filteredMarkets, setFilteredMarkets] = useState<MarketInfo[]>();

  useFetchAllMarkets();
  const markets = useSelector(selectAllMarkets);
  const isLoading = useSelector(selectAllMarketsLoading);

  const onRowClick = (marketPubkey) => {
    setChosenMarketKey(marketPubkey);
    setStep(1);
  };

  const { searchStr, handleSearch } = useSearch();

  useEffect(() => {
    const collections = filterCollections([...markets], searchStr);
    setFilteredMarkets(collections);
  }, [searchStr, markets]);

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <Search onChange={handleSearch} className={styles.searchWrapper} />
          {markets?.length && (
            <ItemsList
              data={filteredMarkets}
              mapType={COLLECTION}
              onRowClick={onRowClick}
              pubKey={PubKeys.MARKET_PUBKEY}
            />
          )}
        </>
      )}
    </>
  );
};
