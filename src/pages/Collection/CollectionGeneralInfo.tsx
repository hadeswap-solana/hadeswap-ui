import { Avatar, Col, Row, Typography } from 'antd';
import { FC } from 'react';
import { mockData } from './mockData';

import styles from './Collection.module.scss';

const { Title, Text } = Typography;

export const CollectionGeneralInfo: FC = () => {
  const { name, imageUrl, floorPrice, bestOffer, offerTVL, volume } = mockData;
  return (
    <>
      <Row justify="center">
        <Col
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar src={imageUrl} size={128} />
          <Title>{name}</Title>
        </Col>
      </Row>
      <div className={styles.infoBlock}>
        <div className={styles.info}>
          <Text strong>Floor</Text>
          <Text>{floorPrice} SOL</Text>
        </div>
        <div className={styles.info}>
          <Text strong>Best offer</Text>
          <Text>{bestOffer} SOL</Text>
        </div>
        <div className={styles.info}>
          <Text strong>Offer TVL</Text>
          <Text>{offerTVL} SOL</Text>
        </div>
        <div className={styles.info}>
          <Text strong>Volume</Text>
          <Text>{volume} SOL</Text>
        </div>
      </div>
    </>
  );
};
