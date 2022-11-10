import { cartActions, cartTypes } from './cartActions';
import { fetchActions, fetchTypes } from './fetchActions';
import { pairsActions, pairsTypes } from './pairsActions';
import { marketActions, marketTypes } from './marketActions';
import {
  marketWalletNftsActions,
  marketWalletNftsTypes,
} from './marketWalletNftsActions';

export const coreTypes = {
  ...fetchTypes,
  ...cartTypes,
  ...pairsTypes,
  ...marketTypes,
  ...marketWalletNftsTypes,
};

export const coreActions = {
  ...fetchActions,
  ...cartActions,
  ...pairsActions,
  ...marketActions,
  ...marketWalletNftsActions,
};
