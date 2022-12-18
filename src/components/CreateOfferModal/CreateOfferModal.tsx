import { CloseOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { FC } from 'react';

interface CreateOfferModalProps {
  visible: boolean;
  onCancel: () => void;
}

const CreateOfferModal: FC<CreateOfferModalProps> = ({ visible, onCancel }) => {
  return (
    <Modal
      visible={visible}
      footer={null}
      centered
      closable
      closeIcon={<CloseOutlined />}
      onCancel={onCancel}
      width={495}
      destroyOnClose
    >
      <div></div>
    </Modal>
  );
};

export default CreateOfferModal;
