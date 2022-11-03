import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import { DisconnectOutlined, WalletOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import ChevronIcon from '../../icons/ChevronIcon';
import PhantomIcon from '../../icons/PhantomIcon';
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
    <button
      className={classNames(styles.root, className)}
      onClick={() => {
        dispatch(commonActions.toggleWalletModal());
      }}
    >
      <span>connect wallet</span>
    </button>
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
      <button className={classNames(styles.root, className)}>
        <PhantomIcon className={styles.phantomIcon} />
        <span>{shortenAddress(publicKey.toBase58())}</span>
        <ChevronIcon className={styles.chevronIcon} />
      </button>
    </Dropdown>
  );
};
