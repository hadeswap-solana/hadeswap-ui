import { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch } from 'react-redux';
import { commonActions } from '../state/common/actions';

export const useWalletInit = (): void => {
  const wallet = useWallet();
  const dispatch = useDispatch();

  useEffect(() => {
    if (wallet.connected) {
      dispatch(commonActions.setWallet(wallet));
    }
  }, [wallet, dispatch]);
};
