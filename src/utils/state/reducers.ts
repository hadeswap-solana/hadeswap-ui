import { Reducer } from 'redux';
import { AsyncState } from './types';

export const createInitialAsyncState = <TData>(
  initialData: TData = null,
): AsyncState<TData> => ({
  data: initialData,
  isLoading: true,
});

export const composeReducers = (...funcs: Reducer[]): Reducer => {
  if (funcs.length === 0) {
    return (arg) => arg;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce(
    (a, b) =>
      (value, ...rest) =>
        a(b(value, ...rest), ...rest),
  );
};
