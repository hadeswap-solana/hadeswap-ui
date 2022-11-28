import { FC } from 'react';
import { useFetchAllMarkets } from '../../../requests';
import { useSelector } from 'react-redux';
import {
  selectAllMarkets,
  selectAllMarketsLoading,
} from '../../../state/core/selectors';
import { Spinner } from '../../../components/Spinner/Spinner';
import ItemsList from '../../../components/ItemsList';
import { COLLECTION, PubKeys } from '../../../constants/common';

interface StepOneProps {
  setStep: (arg: number) => void;
  setChosenMarketKey: (arg: string) => void;
}

export const StepOne: FC<StepOneProps> = ({ setStep, setChosenMarketKey }) => {
  useFetchAllMarkets();
  const markets = useSelector(selectAllMarkets);
  const isLoading = useSelector(selectAllMarketsLoading);

  const onRowClick = (marketPubkey) => {
    setChosenMarketKey(marketPubkey);
    setStep(1);
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <ItemsList
          data={markets}
          mapType={COLLECTION}
          onRowClick={onRowClick}
          pubKey={PubKeys.MARKET_PUBKEY}
        />
      )}
    </>
  );
};
