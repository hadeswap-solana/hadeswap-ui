import { cartActions, cartTypes } from './cartActions';
import { fetchActions, fetchTypes } from './fetchActions';

export const coreTypes = {
  ...fetchTypes,
  ...cartTypes,
};

export const coreActions = {
  ...fetchActions,
  ...cartActions,
};
