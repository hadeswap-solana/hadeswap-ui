import { FC } from 'react';
import { Modal, Tabs } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useFetchAllMarkets } from '../../requests';

import styles from './CreateOfferModal.module.scss';
import BuyTab from './BuyTab/BuyTab';
import SellTab from './SellTab/SellTab';

const { TabPane } = Tabs;

interface CreateOfferModalProps {
  visible: boolean;
  onCancel: () => void;
}

const CreateOfferModal: FC<CreateOfferModalProps> = ({ visible, onCancel }) => {
  useFetchAllMarkets();

  return (
    <Modal
      visible={visible}
      footer={null}
      centered
      closable
      closeIcon={<CloseOutlined />}
      onCancel={onCancel}
      width={495}
      className={styles.modal}
      destroyOnClose
    >
      <div className={styles.header}>
        <div className={styles.title}>limit order</div>
        <Tabs defaultActiveKey="buy" centered className={styles.tabs}>
          <TabPane key="buy" tab="buy">
            <BuyTab onCancel={onCancel} />
          </TabPane>
          <TabPane key="sell" tab="sell">
            <SellTab onCancel={onCancel} />
          </TabPane>
        </Tabs>
      </div>
    </Modal>
  );
};

export default CreateOfferModal;
