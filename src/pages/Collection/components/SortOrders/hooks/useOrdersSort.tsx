import { useMemo } from 'react';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Control, useForm } from 'react-hook-form';

import { MarketOrder } from '../../../../../state/core/types';
import { compareNumbers } from '../../../../../utils';

export enum SORT_ORDER {
  ASC = 'asc',
  DESC = 'desc',
}

enum SortField {
  MOON_RANK = 'moonrank',
  HOW_RARE = 'howrare',
  PRICE = 'price',
}

export enum FilterFormInputsNames {
  SORT = 'sort',
}

export type OrderSortValue = {
  label: JSX.Element;
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
  const isExistHowRarity = !orders.find(({ rarity }) => rarity.howRareIs);
  const isExistMoonRarity = !orders.find(({ rarity }) => rarity.moonRank);

  const optionsMobile = sortValuesMobile(isExistHowRarity, isExistMoonRarity);
  const options = sortValues(isExistHowRarity, isExistMoonRarity);

  const { control, watch, setValue } = useForm({
    defaultValues: {
      [FilterFormInputsNames.SORT]: options[0],
    },
  });

  const sort = watch(FilterFormInputsNames.SORT);

  const sortedOrders = useMemo(() => {
    if (orders.length) {
      const [sortField, sortOrder] = sort.value.split('_');
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
          price <ArrowUpOutlined />
        </>
      ),
      value: 'price_asc',
    },
    {
      label: (
        <>
          price <ArrowDownOutlined />
        </>
      ),
      value: 'price_desc',
    },
    {
      label: (
        <>
          moonrank <ArrowUpOutlined />
        </>
      ),
      value: 'moonrank_asc',
      isDisabled: isExistMoonRarity,
    },
    {
      label: (
        <>
          moonrank <ArrowDownOutlined />
        </>
      ),
      value: 'moonrank_desc',
      isDisabled: isExistMoonRarity,
    },
    {
      label: (
        <>
          howrare <ArrowUpOutlined />
        </>
      ),
      value: 'howrare_asc',
      isDisabled: isExistHowRarity,
    },
    {
      label: (
        <>
          howrare <ArrowDownOutlined />
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
      label: (
        <>
          <p>price</p>
          <ArrowUpOutlined />
        </>
      ),
      value: 'price',
    },
    {
      label: (
        <>
          <p>moonrank</p>
          <ArrowUpOutlined />
        </>
      ),
      isDisabled: isExistMoonRarity,
      value: 'moonrank',
    },
    {
      label: (
        <>
          <p>howrare</p>
          <ArrowUpOutlined />
        </>
      ),
      value: 'howrare',
      isDisabled: isExistHowRarity,
    },
  ];
};

// export const SORT_VALUES_MOBILE: OrderSortValue[] = [
//   {
//     label: (
//       <>
//         <p>price</p>
//         <ArrowUpOutlined />
//       </>
//     ),
//     value: 'price',
//   },
//   {
//     label: (
//       <>
//         <p>moonrank</p>
//         <ArrowUpOutlined />
//       </>
//     ),
//     value: 'moonrank',
//   },
//   {
//     label: (
//       <>
//         <p>howrare</p>
//         <ArrowUpOutlined />
//       </>
//     ),
//     value: 'howrare',
//   },
// ];
