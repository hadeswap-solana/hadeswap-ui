import { useDispatch, useSelector } from 'react-redux';
import { commonActions } from '../../state/common/actions';
import { selectCreateOfferModalVisible } from '../../state/common/selectors';

type UseCreateOfferModal = () => {
  visible: boolean;
  open: () => void;
  close: () => void;
};

export const useCreateOfferModal: UseCreateOfferModal = () => {
  const dispatch = useDispatch();
  const visible = useSelector(selectCreateOfferModalVisible);

  const open = () => {
    dispatch(commonActions.setCreateOfferModal({ isVisible: true }));
  };

  const close = () => {
    dispatch(commonActions.setCreateOfferModal({ isVisible: false }));
  };

  return {
    visible,
    open,
    close,
  };
};
