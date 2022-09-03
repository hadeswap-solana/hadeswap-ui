import { Spin } from 'antd';
import { FC } from 'react';

export const Spinner: FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <Spin size="large" />
    </div>
  );
};
