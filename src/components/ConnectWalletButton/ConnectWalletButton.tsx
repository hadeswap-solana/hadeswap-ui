import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch } from 'react-redux';
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
