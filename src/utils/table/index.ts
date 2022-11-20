import {
  POOL_TABLE_COLUMNS,
  COLLECTION_COLUMNS,
  ACTIVITY_COLUMNS,
} from './constants';
import { POOL_ITEM, COLLECTION_ITEM, ACTIVITY_ITEM } from './mobile/constants';
import { COLLECTION, POOL, ACTIVITY } from '../../constants/common';

export const columnsType = {
  [COLLECTION]: COLLECTION_COLUMNS,
  [POOL]: POOL_TABLE_COLUMNS,
  [ACTIVITY]: ACTIVITY_COLUMNS,
};

export const mobileItemsType = {
  [COLLECTION]: COLLECTION_ITEM,
  [POOL]: POOL_ITEM,
  [ACTIVITY]: ACTIVITY_ITEM,
};
