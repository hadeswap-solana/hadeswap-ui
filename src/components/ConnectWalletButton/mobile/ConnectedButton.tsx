import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';
import Button from '../../Buttons/Button';
import { WalletIcon } from '../../../icons/WalletIcon';
import { DisconnectIcon } from '../../../icons/DisconnectIcon';
import { shortenAddress } from '../../../utils/solanaUtils';
import { useDispatch } from 'react-redux';
import { commonActions } from '../../../state/common/actions';

import styles from '../ConnectWalletButton.module.scss';

export const ConnectedButtonMobile: FC = () => {
  const dispatch = useDispatch();
  const { publicKey, disconnect, wallet } = useWallet();

  return (
    <div className={styles.mobileButtonsWrapper}>
      <Button className={styles.button} outlined>
        <img src={wallet.adapter.icon} className={styles.walletIcon} />
        <span>{shortenAddress(publicKey.toBase58())}</span>
      </Button>
      <button
        onClick={() =>
          dispatch(commonActions.setWalletModal({ isVisible: true }))
        }
        className={classNames(styles.button, styles.outlinedButton)}
      >
        <WalletIcon />
        <span>change wallet</span>
      </button>
      <button
        onClick={disconnect}
        className={classNames(styles.button, styles.outlinedButton)}
      >
        <DisconnectIcon />
        <span>disconnect</span>
      </button>
    </div>
  );
};
