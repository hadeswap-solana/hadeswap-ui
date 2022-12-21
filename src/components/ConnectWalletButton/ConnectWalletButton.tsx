import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch } from 'react-redux';
import { Dropdown, Menu } from 'antd';
import Button from '../Buttons/Button';
import { commonActions } from '../../state/common/actions';
import { shortenAddress } from '../../utils/solanaUtils';

import ChevronIcon from '../../icons/ChevronIcon';
import PhantomIcon from '../../icons/PhantomIcon';
import { DisconnectIcon } from '../../icons/DisconnectIcon';
import { WalletIcon } from '../../icons/WalletIcon';
import styles from './ConnectWalletButton.module.scss';

export interface ConnectButtonProps {
  className?: string;
}

export const ConnectWalletButton: FC<ConnectButtonProps> = ({ className }) => {
  const dispatch = useDispatch();
  const { connected, publicKey, disconnect } = useWallet();

  return !connected ? (
    <Button
      outlined
      className={className}
      onClick={() => {
        dispatch(commonActions.toggleWalletModal());
      }}
    >
      <span>connect wallet</span>
    </Button>
  ) : (
    <Dropdown
      overlay={
        <Menu
          items={[
            {
              label: 'change wallet',
              key: '1',
              icon: <WalletIcon />,
              onClick: () =>
                dispatch(commonActions.setWalletModal({ isVisible: true })),
            },
            {
              label: 'disconnect',
              key: '2',
              icon: <DisconnectIcon />,
              onClick: disconnect,
            },
          ]}
        />
      }
    >
      <div>
        <Button className={className} outlined>
          <PhantomIcon className={styles.phantomIcon} />
          <span>{shortenAddress(publicKey.toBase58())}</span>
          <ChevronIcon className={styles.chevronIcon} />
        </Button>
      </div>
    </Dropdown>
  );
};
