import { FC, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useFetchAllMarkets } from '../../../requests';
import { Spinner } from '../../../components/Spinner/Spinner';
import ItemsList from '../../../components/ItemsList';
import { Search } from '../../../components/Search';
import { useSearch } from '../../../components/Search/useSearch';
import { COLLECTION } from '../../../constants/common';
import { PubKeys } from '../../../types';
import { filterCollections } from '../../Collections/helpers';
import { MarketInfo } from '../../../state/core/types';
import { createCreatePoolPickSideLink } from '../../../constants';
import {
  selectAllMarkets,
  selectAllMarketsLoading,
} from '../../../state/core/selectors';

import styles from './styles.module.scss';

interface StepOneProps {
  setStep: (arg: number) => void;
  setChosenMarketKey: (arg: string) => void;
}

export const StepOne: FC<StepOneProps> = ({ setStep, setChosenMarketKey }) => {
  const history = useHistory();

  const [showList, setShowList] = useState<boolean>(false);
  const [filteredMarkets, setFilteredMarkets] = useState<MarketInfo[]>();

  useFetchAllMarkets();
  const markets = useSelector(selectAllMarkets);
  const isLoading = useSelector(selectAllMarketsLoading);

  const onRowClick = (marketPubkey) => {
    setChosenMarketKey(marketPubkey);
    setStep(1);
    history.push(createCreatePoolPickSideLink(marketPubkey));
  };

  const { searchStr, handleSearch } = useSearch();

  useEffect(() => {
    const filteredCollections = filterCollections([...markets], searchStr);
    setFilteredMarkets(filteredCollections);
    markets.length && setShowList(true);
  }, [searchStr, markets]);

  return (
    <>
      {isLoading || !showList ? (
        <Spinner />
      ) : (
        <>
          <Search onChange={handleSearch} className={styles.searchWrapper} />
          <ItemsList
            data={filteredMarkets}
            mapType={COLLECTION}
            onRowClick={onRowClick}
            pubKey={PubKeys.MARKET_PUBKEY}
          />
        </>
      )}
    </>
  );
};
