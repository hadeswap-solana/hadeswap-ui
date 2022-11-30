import { useWallet } from '@solana/wallet-adapter-react';
import {
  DisconnectOutlined,
  DownOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Menu, Space } from 'antd';
import { useDispatch } from 'react-redux';
import { commonActions } from '../../state/common/actions';
import { shortenAddress } from '../../utils/solanaUtils';
import { FC } from 'react';
import styles from './ConnectWalletButton.module.scss';
import classNames from 'classnames';

export interface ConnectButtonProps {
  className?: string;
}

export const ConnectWalletButton: FC<ConnectButtonProps> = ({ className }) => {
  const dispatch = useDispatch();

  const { connected, publicKey, disconnect } = useWallet();

  return !connected ? (
    <Button
      className={classNames(styles.root, className)}
      type="ghost"
      onClick={() => {
        dispatch(commonActions.toggleWalletModal());
      }}
    >
      connect wallet
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
      <Button className={classNames(styles.root, className)} type="ghost">
        <Space>
          {shortenAddress(publicKey.toBase58())}
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
  );
};
