import { InfoCircleOutlined } from '@ant-design/icons';
import { Typography, Row, Col, Tooltip } from 'antd';
import { FC } from 'react';

const { Text } = Typography;

export const TitleWithInfo: FC = ({ title, infoText }) => {
  return (
    <Row align="middle" justify="start" gutter={[8, 0]}>
      <Col>
        <Text>{title}</Text>
      </Col>
      <Tooltip placement="top" title={infoText}>
        <InfoCircleOutlined />
      </Tooltip>
    </Row>
  );
};
