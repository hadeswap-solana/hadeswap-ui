import { Spin } from 'antd';
import { FC } from 'react';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 32 }} spin />;

export const Spinner: FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <Spin className={className} size="large" indicator={antIcon} />
    </div>
  );
};
