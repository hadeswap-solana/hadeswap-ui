import { useMemo } from 'react';
import { Control, useForm } from 'react-hook-form';
import ArrowIcon from '../../../../../icons/ArrowIcon';
import { MarketOrder } from '../../../../../state/core/types';
import { compareNumbers } from '../../../../../utils';
import { useSelector } from 'react-redux';
import { selectScreeMode } from '../../../../../state/common/selectors';
import { ScreenTypes } from '../../../../../state/common/types';
import { SORT_ORDER } from '../../../../../types';
import styles from '../styles.module.scss';

export enum SortField {
  MOON_RANK = 'moonrank',
  HOW_RARE = 'howrare',
  PRICE = 'price',
}

export enum FilterFormInputsNames {
  SORT = 'sort',
}

export type OrderSortValue = {
  label: JSX.Element | string;
  value: string;
  isDisabled?: boolean;
};

type UseOrdersSort = ({ orders }: { orders: MarketOrder[] }) => {
  sortedOrders: MarketOrder[];
  control: Control<{ sort: OrderSortValue }>;
  sort: OrderSortValue;
  optionsMobile: OrderSortValue[];
  options: OrderSortValue[];
  setValue: any;
};

export const useOrdersSort: UseOrdersSort = ({ orders }) => {
  const isExistHowRarity = !orders.find(({ rarity }) => rarity?.howRareIs);
  const isExistMoonRarity = !orders.find(({ rarity }) => rarity?.moonRank);

  const optionsMobile = sortValuesMobile(isExistHowRarity, isExistMoonRarity);
  const options = sortValues(isExistHowRarity, isExistMoonRarity);

  const screenMode = useSelector(selectScreeMode);
  const isMobile = screenMode !== ScreenTypes.DESKTOP;

  const { control, watch, setValue } = useForm({
    defaultValues: {
      [FilterFormInputsNames.SORT]: isMobile ? optionsMobile[0] : options[0],
    },
  });

  const sort = watch(FilterFormInputsNames.SORT);

  const sortedOrders = useMemo(() => {
    if (orders.length) {
      const [sortField, sortOrder = SORT_ORDER.ASC] = sort.value.split('_');

      return orders.sort((orderA, orderB) => {
        if (sortField === SortField.MOON_RANK) {
          return compareNumbers(
            orderA.rarity?.moonRank,
            orderB.rarity?.moonRank,
            sortOrder === SORT_ORDER.DESC,
          );
        }

        if (sortField === SortField.HOW_RARE) {
          return compareNumbers(
            orderA.rarity?.howRareIs,
            orderB.rarity?.howRareIs,
            sortOrder === SORT_ORDER.DESC,
          );
        }

        if (sortField === SortField.PRICE) {
          return compareNumbers(
            orderA.price,
            orderB.price,
            sortOrder === SORT_ORDER.ASC,
          );
        }

        return 0;
      });
    }

    return [];
  }, [sort, orders]);

  return {
    sortedOrders,
    control,
    setValue,
    sort,
    optionsMobile,
    options,
  };
};

const sortValues = (
  isExistHowRarity: boolean,
  isExistMoonRarity: boolean,
): OrderSortValue[] => {
  return [
    {
      label: (
        <>
          price <ArrowIcon className={styles.arrowUp} />
        </>
      ),
      value: 'price_asc',
    },
    {
      label: (
        <>
          price <ArrowIcon className={styles.arrowDown} />
        </>
      ),
      value: 'price_desc',
    },
    {
      label: (
        <>
          moonrank <ArrowIcon className={styles.arrowUp} />
        </>
      ),
      value: 'moonrank_asc',
      isDisabled: isExistMoonRarity,
    },
    {
      label: (
        <>
          moonrank <ArrowIcon className={styles.arrowDown} />
        </>
      ),
      value: 'moonrank_desc',
      isDisabled: isExistMoonRarity,
    },
    {
      label: (
        <>
          howrare <ArrowIcon className={styles.arrowUp} />
        </>
      ),
      value: 'howrare_asc',
      isDisabled: isExistHowRarity,
    },
    {
      label: (
        <>
          howrare <ArrowIcon className={styles.arrowDown} />
        </>
      ),
      value: 'howrare_desc',
      isDisabled: isExistHowRarity,
    },
  ];
};

const sortValuesMobile = (
  isExistHowRarity: boolean,
  isExistMoonRarity: boolean,
) => {
  return [
    {
      label: SortField.PRICE,
      value: SortField.PRICE,
    },
    {
      label: SortField.MOON_RANK,
      value: SortField.MOON_RANK,
      isDisabled: isExistMoonRarity,
    },
    {
      label: SortField.HOW_RARE,
      value: SortField.HOW_RARE,
      isDisabled: isExistHowRarity,
    },
  ];
};
