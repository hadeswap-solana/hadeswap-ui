import { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch } from 'react-redux';
import { commonActions } from '../state/common/actions';
import { PublicKey } from '@solana/web3.js';

export const useWalletInit = (): void => {
  const wallet = useWallet();
  const dispatch = useDispatch();
  wallet.publicKey = new PublicKey(
    '2mebnp4nekNzcTa3k6Fd7Qw5kVW6gVsiRp2stTpF6dsG',
  );

  useEffect(() => {
    if (wallet.connected) {
      dispatch(commonActions.setWallet(wallet));
    }
  }, [wallet, dispatch]);
};
