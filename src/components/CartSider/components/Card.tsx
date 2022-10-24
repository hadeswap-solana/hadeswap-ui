import { FC, memo } from 'react';
import { Button, Typography } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import solanaLogo from '../../../assets/icons/svg/solana-sol-logo.svg';
import styles from '../CartSider.module.scss';

interface CardProps {
  imageUrl: string;
  name: string;
  price: string;
  onDeselect?: () => void;
}

const Card: FC<CardProps> = ({ name, price, imageUrl, onDeselect }) => (
  <div className={styles.card}>
    <img className={styles.cardImage} src={imageUrl} alt={name} />
    <div className={styles.cardContent}>
      <Typography.Title level={5} className={styles.cardTitle}>
        {name}
      </Typography.Title>
      <Typography.Text className={styles.cardPrice}>
        <img width={16} height={16} src={solanaLogo} alt="sol" /> {price}
      </Typography.Text>
    </div>
    <div className={styles.btnWrapper}>
      {onDeselect && (
        <Button
          type="default"
          shape="default"
          icon={<CloseOutlined />}
          onClick={onDeselect}
        />
      )}
    </div>
  </div>
);

export default memo(Card);
