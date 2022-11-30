import {
  POOL_TABLE_COLUMNS,
  COLLECTION_COLUMNS,
  ACTIVITY_COLUMNS,
  POOL_TRADE_COLUMNS,
} from './constants';
import {
  POOL_ITEM,
  COLLECTION_ITEM,
  ACTIVITY_ITEM,
  TRADE_ITEM,
} from './mobile/constants';
import { COLLECTION, POOL, ACTIVITY, TRADE } from '../../constants/common';

export const columnsType = {
  [COLLECTION]: COLLECTION_COLUMNS,
  [POOL]: POOL_TABLE_COLUMNS,
  [ACTIVITY]: ACTIVITY_COLUMNS,
  [TRADE]: POOL_TRADE_COLUMNS,
};

export const mobileItemsType = {
  [COLLECTION]: COLLECTION_ITEM,
  [POOL]: POOL_ITEM,
  [ACTIVITY]: ACTIVITY_ITEM,
  [TRADE]: TRADE_ITEM,
};
