import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectExchangeModalVisible } from '../../state/common/selectors';
import { commonActions } from '../../state/common/actions';

type UseExchangeModal = () => {
  visible: boolean;
  open: () => void;
  close: () => void;
};

export const useExchangeModal: UseExchangeModal = () => {
  const dispatch = useDispatch();
  const visible = useSelector(selectExchangeModalVisible);

  const open = useCallback(() => {
    dispatch(commonActions.setExchangeModal({ isVisible: true }));
  }, [dispatch]);

  const close = useCallback(() => {
    dispatch(commonActions.setExchangeModal({ isVisible: false }));
  }, [dispatch]);

  return {
    visible,
    open,
    close,
  };
};
