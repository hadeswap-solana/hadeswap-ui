import { FC } from 'react';
import { useDispatch } from 'react-redux';
import Button from '../Buttons/Button';
import { commonActions } from '../../state/common/actions';

import styles from './ConnectWalletButton.module.scss';

export const DisconnectedButton: FC = () => {
  const dispatch = useDispatch();
  return (
    <Button
      outlined
      className={styles.button}
      onClick={() => {
        dispatch(commonActions.toggleWalletModal());
      }}
    >
      <span>connect wallet</span>
    </Button>
  );
};
