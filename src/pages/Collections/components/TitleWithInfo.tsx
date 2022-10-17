import { FC } from 'react';
import { RowProps, Typography, Row, Col, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface TitleWithInfoProps extends RowProps {
  title: string;
  infoText: string;
}

export const TitleWithInfo: FC<TitleWithInfoProps> = ({
  title,
  infoText,
  justify = 'start',
}) => {
  return (
    <Row align="middle" justify={justify} gutter={[8, 0]}>
      <Col>
        <Text>{title}</Text>
      </Col>
      <Tooltip placement="top" title={infoText}>
        <InfoCircleOutlined />
      </Tooltip>
    </Row>
  );
};
