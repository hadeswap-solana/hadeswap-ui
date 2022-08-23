import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWallet } from '@solana/wallet-adapter-react';
import { Modal } from 'antd';

import { commonActions } from '../../state/common/actions';
import { selectWalletModalVisible } from '../../state/common/selectors';
import styles from './SelectWalletModal.module.scss';

export const SelectWalletModal: FC = () => {
  const dispatch = useDispatch();

  const visible = useSelector(selectWalletModalVisible);

  const { wallets, select } = useWallet();

  return (
    <Modal
      visible={!!visible}
      title="Select wallet"
      footer={null}
      closable
      onCancel={() =>
        dispatch(commonActions.setWalletModal({ isVisible: false }))
      }
    >
      <div className={styles.grid}>
        {wallets.map(({ adapter }, idx) => (
          <WalletItem
            key={idx}
            onClick={(): void => {
              select(adapter.name);
              dispatch(commonActions.setWalletModal({ isVisible: false }));
            }}
            imageSrc={adapter.icon}
            imageAlt={adapter.name}
            name={adapter.name}
          />
        ))}
      </div>
    </Modal>
  );
};

interface WalletItemProps {
  onClick: () => void;
  imageSrc: string;
  imageAlt: string;
  name: string;
}

const WalletItem = ({
  onClick,
  imageSrc,
  imageAlt,
  name,
}: WalletItemProps): JSX.Element => {
  return (
    <div className={styles.gridItem} onClick={onClick}>
      <img alt={imageAlt} src={imageSrc} />
      {name}
    </div>
  );
};
