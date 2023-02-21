import { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch } from 'react-redux';
import { commonActions } from '../state/common/actions';
import { web3 } from 'hadeswap-sdk';

export const useWalletInit = (): void => {
  const wallet = useWallet();
  const dispatch = useDispatch();

  // wallet.publicKey = new web3.PublicKey(
  //   'Fzx2MEY6fuwjoL1g4Mh5D6dcxp24HEcdZ1QsrVxE5sfs',
  // );
  useEffect(() => {
    if (wallet.connected) {
      dispatch(commonActions.setWallet(wallet));
    }
  }, [wallet, dispatch]);
};
