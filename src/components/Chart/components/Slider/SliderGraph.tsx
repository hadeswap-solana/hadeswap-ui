import React, { FC, useState } from 'react';
import { Col, InputNumber, Row, Slider } from 'antd';
import styles from './SliderGraph.module.scss';
import classNames from 'classnames';

const SliderGraph: FC = () => {
  const [buyValue, setBuyValue] = useState(10);
  const [sellValue, setSellValue] = useState(10);

  const buyHandler = (newValue: number) => {
    setBuyValue(newValue);
  };
  const sellHandler = (newValue: number) => {
    setSellValue(newValue);
  };

  return (
    <div className={styles.root}>
      <div className={styles.col}>
        <div className={classNames(styles.amount, styles.buy)}>
          buying 5 NFTs...
        </div>
        <div className={styles.buy}>
          <div className={styles.value}>0</div>
          <Slider
            className={styles.slider}
            tooltipVisible={false}
            min={1}
            max={20}
            onChange={buyHandler}
            value={typeof buyValue === 'number' ? buyValue : 0}
          />
          <div className={styles.value}>{buyValue}</div>
        </div>
        <div className={styles.buy}>will cost this pool 12.191 SOL</div>
      </div>

      <div className={styles.col}>
        <div className={classNames(styles.amount, styles.sell)}>
          selling 10 NFTs...
        </div>
        <div className={styles.sell}>
          <div className={styles.value}>0</div>
          <Slider
            className={styles.slider}
            tooltipVisible={false}
            min={1}
            max={20}
            onChange={sellHandler}
            value={typeof sellValue === 'number' ? sellValue : 0}
          />
          <div className={styles.value}>{sellValue}</div>
        </div>
        <div className={styles.sell}>will earn this pool 35.303 SOL</div>
      </div>
    </div>
  );
};

export default SliderGraph;
