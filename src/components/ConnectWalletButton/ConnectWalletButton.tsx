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

export interface ConnectButtonProps {
  className?: string;
}

export const ConnectWalletButton = ({
  className,
}: ConnectButtonProps): JSX.Element => {
  const dispatch = useDispatch();

  const { connected, publicKey, disconnect } = useWallet();

  return !connected ? (
    <Button
      className={className}
      type="primary"
      onClick={() => {
        dispatch(commonActions.toggleWalletModal());
      }}
    >
      Connect wallet
    </Button>
  ) : (
    <Dropdown
      overlay={
        <Menu
          items={[
            {
              label: 'Change wallet',
              key: '1',
              icon: <WalletOutlined />,
              onClick: () =>
                dispatch(commonActions.setWalletModal({ isVisible: true })),
            },
            {
              label: 'Disconnect',
              key: '2',
              icon: <DisconnectOutlined />,
              onClick: disconnect,
            },
          ]}
        />
      }
    >
      <Button className={className} type="primary">
        <Space>
          {shortenAddress(publicKey.toBase58())}
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
  );
};
