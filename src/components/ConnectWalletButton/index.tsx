import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { ConnectedButton as ConnectedButtonDesktop } from './ConnectedButton';
import { ConnectedButtonMobile } from './mobile/ConnectedButton';
import { DisconnectedButton } from './DisconnectedButton';
import { useSelector } from 'react-redux';
import { selectScreeMode } from '../../state/common/selectors';
import { ScreenTypes } from '../../state/common/types';

export const ConnectWalletButton: FC = () => {
  const { connected } = useWallet();
  const screenMode = useSelector(selectScreeMode);

  const ConnectedButton =
    screenMode !== ScreenTypes.TABLET
      ? ConnectedButtonDesktop
      : ConnectedButtonMobile;

  return connected ? <ConnectedButton /> : <DisconnectedButton />;
};
