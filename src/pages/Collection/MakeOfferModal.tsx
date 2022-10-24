import { FC } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Descriptions, Form, InputNumber, Modal } from 'antd';
import styles from './Collection.module.scss';

interface IMakeOfferModal {
  isVisible: boolean;
  onCancel: () => void;
}

export const MakeOfferModal: FC<IMakeOfferModal> = ({
  isVisible,
  onCancel,
}) => {
  const [form] = Form.useForm();

  const onSubmit = () => {
    form.submit();
  };

  const onFormChange = () => {
    // console.log(form.getFieldsValue(['nftAmount', 'price', 'decreaseBy']));
  };

  return (
    <Modal
      visible={isVisible}
      title="Collection offer"
      footer={[
        <Button key="submit" type="primary" onClick={onSubmit}>
          Create offer
        </Button>,
      ]}
      onCancel={onCancel}
    >
      <div className={styles.nftCard}>
        <img
          width={100}
          height={100}
          src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
        />
        <Descriptions title="Collection" column={1}>
          <Descriptions.Item label="Lowest floor">0.424 sol</Descriptions.Item>
          <Descriptions.Item label="Highest offer">0.407 sol</Descriptions.Item>
        </Descriptions>
      </div>
      <Form
        layout="vertical"
        form={form}
        initialValues={{ nftAmount: 1, price: 1, decreaseBy: 0 }}
        onValuesChange={onFormChange}
      >
        <Form.Item
          name="nftAmount"
          label="NFT amount"
          tooltip={{
            title: 'The maximum number of items you will buy.',
            icon: <InfoCircleOutlined />,
          }}
        >
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item name="price" label="Price">
          <InputNumber addonAfter="SOL" min="0" />
        </Form.Item>
        <Form.Item
          name="decreaseBy"
          label="Decrease by"
          tooltip={{
            title:
              'Your price will decrease by this much each time someone sells you an NFT.',
            icon: <InfoCircleOutlined />,
          }}
        >
          <InputNumber addonAfter="%" min="0" />
        </Form.Item>
      </Form>
      <Descriptions column={1}>
        <Descriptions.Item label="Total">0.407 ETH</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};
