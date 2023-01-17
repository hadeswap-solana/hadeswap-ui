import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { useWallet } from '@solana/wallet-adapter-react';
import { Dropdown, Menu } from 'antd';
import Button from '../Buttons/Button';
import { WalletIcon } from '../../icons/WalletIcon';
import { DisconnectIcon } from '../../icons/DisconnectIcon';
import PhantomIcon from '../../icons/PhantomIcon';
import ChevronIcon from '../../icons/ChevronIcon';
import { commonActions } from '../../state/common/actions';
import { shortenAddress } from '../../utils/solanaUtils';

import styles from './ConnectWalletButton.module.scss';

export const ConnectedButton: FC = () => {
  const dispatch = useDispatch();
  const { publicKey, disconnect } = useWallet();

  return (
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
        <Button className={styles.button} outlined>
          <PhantomIcon className={styles.phantomIcon} />
          <span>{shortenAddress(publicKey.toBase58())}</span>
          <ChevronIcon className={styles.chevronIcon} />
        </Button>
      </div>
    </Dropdown>
  );
};
