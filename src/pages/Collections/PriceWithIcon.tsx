import { Typography, Row, Col } from 'antd';
import { FC } from 'react';
import SolanaLogo from '../../assets/icons/svg/solana-sol-logo.svg';

const { Text } = Typography;

interface PriceWithIconProps {
  price: string;
}

export const PriceWithIcon: FC<PriceWithIconProps> = ({ price }) => {
  return (
    <Row align="middle" justify="start" gutter={[8, 0]}>
      <img width={16} height={16} src={SolanaLogo} />
      <Col>
        <Text>{price}</Text>
      </Col>
    </Row>
  );
};
