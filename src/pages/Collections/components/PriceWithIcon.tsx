import { Typography, Row, Col } from 'antd';
import { FC } from 'react';
import SolanaLogo from '../../../assets/icons/svg/solana-sol-logo.svg';

const { Text } = Typography;

interface PriceWithIconProps {
  price: string;
  rightIcon?: boolean;
}

export const PriceWithIcon: FC<PriceWithIconProps> = ({ price, rightIcon = false }) => {
  const Img = <img width={16} height={16} src={SolanaLogo} alt="SOL" />
  return (
    <Row align="middle" justify="start" gutter={[8, 0]}>
      {!rightIcon && Img}
      <Col>
        <Text>{price}</Text>
      </Col>
      {rightIcon && Img}
    </Row>
  );
};
