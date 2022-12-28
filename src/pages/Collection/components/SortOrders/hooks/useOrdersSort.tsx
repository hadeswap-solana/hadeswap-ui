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
}

export enum FilterFormInputsNames {
  SORT = 'sort',
}

export type OrderSortValue = {
  label: JSX.Element;
  value: string;
};

type UseOrdersSort = ({ orders }: { orders: MarketOrder[] }) => {
  sortedOrders: MarketOrder[];
  control: Control<{ sort: OrderSortValue }>;
  sort: OrderSortValue;
  setValue: any;
};

export const useOrdersSort: UseOrdersSort = ({ orders }) => {
  const { control, watch, setValue } = useForm({
    defaultValues: {
      [FilterFormInputsNames.SORT]: SORT_VALUES[0],
    },
  });

  const sort = watch(FilterFormInputsNames.SORT);

  const sortedOrders = useMemo(() => {
    if (orders?.length) {
      const [sortField, sortOrder] = sort.value.split('_');
      return orders.sort((orderA, orderB) => {
        if (sortField === SortField.MOON_RANK) {
          return compareNumbers(
            orderA.rarity.moonRank,
            orderB.rarity.moonRank,
            sortOrder === SORT_ORDER.DESC,
          );
        }

        if (sortField === SortField.HOW_RARE) {
          return compareNumbers(
            orderA.rarity.howRareIs,
            orderB.rarity.howRareIs,
            sortOrder === SORT_ORDER.DESC,
          );
        }

        return 0;
      });
    }

    return [];
  }, [sort, setValue, orders]);

  return {
    sortedOrders,
    control,
    setValue,
    sort,
  };
};

export const SORT_VALUES: OrderSortValue[] = [
  {
    label: (
      <>
        moonrank <ArrowUpOutlined />
      </>
    ),
    value: 'moonrank_asc',
  },
  {
    label: (
      <>
        moonrank <ArrowDownOutlined />
      </>
    ),
    value: 'moonrank_desc',
  },
  {
    label: (
      <>
        howrare <ArrowUpOutlined />
      </>
    ),
    value: 'howrare_asc',
  },
  {
    label: (
      <>
        howrare <ArrowDownOutlined />
      </>
    ),
    value: 'howrare_desc',
  },
];

export const SORT_VALUES_MOBILE: OrderSortValue[] = [
  {
    label: <span>moonrank</span>,
    value: 'moonrank',
  },
  {
    label: <span>howrare</span>,
    value: 'howrare',
  },
];
