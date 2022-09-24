import { Avatar, Col, Row, Typography } from 'antd';
import { FC } from 'react';

import styles from './Collection.module.scss';

const { Title, Text } = Typography;

interface CollectionGeneralInfoProps {
  collectionName?: string;
  collectionImage?: string;
  floorPrice?: string;
  bestoffer?: string;
  offerTVL?: string;
}

export const CollectionGeneralInfo: FC<CollectionGeneralInfoProps> = ({
  collectionName = 'untitled collection',
  collectionImage = '',
  floorPrice = '0',
  bestoffer = '0',
  offerTVL = '0',
}) => {
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
          <Avatar src={collectionImage} size={128} />
          <Title>{collectionName}</Title>
        </Col>
      </Row>
      <div className={styles.infoBlock}>
        <div className={styles.info}>
          <Text strong>floor</Text>
          <Text>{floorPrice} sol</Text>
        </div>
        <div className={styles.info}>
          <Text strong>best offer</Text>
          <Text>{bestoffer} sol</Text>
        </div>
        <div className={styles.info}>
          <Text strong>offer TVL</Text>
          <Text>{offerTVL} sol</Text>
        </div>
        {/* <div className={styles.info}>
          <Text strong>Volume</Text>
          <Text>{volume} SOL</Text>
        </div> */}
      </div>
    </>
  );
};
