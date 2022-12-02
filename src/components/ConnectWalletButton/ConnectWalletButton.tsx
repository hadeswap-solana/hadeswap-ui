import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { web3 } from 'hadeswap-sdk';
import { DisconnectOutlined, WalletOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import ChevronIcon from '../../icons/ChevronIcon';
import PhantomIcon from '../../icons/PhantomIcon';
import Button from '../Buttons/Button';
import { commonActions } from '../../state/common/actions';
import { shortenAddress } from '../../utils/solanaUtils';

import styles from './ConnectWalletButton.module.scss';

export interface ConnectButtonProps {
  className?: string;
  connected: boolean;
  publicKey: web3.PublicKey;
  disconnect: () => void;
}

export const ConnectWalletButton: FC<ConnectButtonProps> = ({
  className,
  connected,
  publicKey,
  disconnect,
}) => {
  const dispatch = useDispatch();

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
              icon: <WalletOutlined />,
              onClick: () =>
                dispatch(commonActions.setWalletModal({ isVisible: true })),
            },
            {
              label: 'disconnect',
              key: '2',
              icon: <DisconnectOutlined />,
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
