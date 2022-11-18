import { cartActions, cartTypes } from './cartActions';
import { pairsActions, pairsTypes } from './pairsActions';
import { marketActions, marketTypes } from './marketActions';
import {
  marketWalletNftsActions,
  marketWalletNftsTypes,
} from './marketWalletNftsActions';

export const coreTypes = {
  ...cartTypes,
  ...pairsTypes,
  ...marketTypes,
  ...marketWalletNftsTypes,
};

export const coreActions = {
  ...cartActions,
  ...pairsActions,
  ...marketActions,
  ...marketWalletNftsActions,
};
