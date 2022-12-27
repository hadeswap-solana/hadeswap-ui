import { FC } from 'react';
import { CrossmintPayButton } from '@crossmint/client-sdk-react-ui';
import { CrossMintConfig } from '../hooks';

import styles from './styles.module.scss';

interface CrossmintButtonProps {
  isOneBuyNft: boolean;
  crossmintConfig: CrossMintConfig;
}

export const CrossmintButton: FC<CrossmintButtonProps> = ({
  isOneBuyNft,
  crossmintConfig,
}) => {
  return (
    <>
      {isOneBuyNft && (
        <CrossmintPayButton
          className={styles.xmintBtn}
          clientId="2c177343-d95d-44e7-8825-e080be6ea3d8"
          mintConfig={crossmintConfig}
        />
      )}
    </>
  );
};
