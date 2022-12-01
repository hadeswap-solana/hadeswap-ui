import { useDispatch, useSelector } from 'react-redux';

import { selectExchangeModalVisible } from '../../state/common/selectors';
import { commonActions } from './../../state/common/actions';

type UseExchangeModal = () => {
  visible: boolean;
  open: () => void;
  close: () => void;
};

export const useExchangeModal: UseExchangeModal = () => {
  const dispatch = useDispatch();
  const visible = useSelector(selectExchangeModalVisible);

  const open = () => {
    dispatch(commonActions.setExchangeModal({ isVisible: true }));
  };

  const close = () => {
    dispatch(commonActions.setExchangeModal({ isVisible: false }));
  };

  return {
    visible,
    open,
    close,
  };
};
