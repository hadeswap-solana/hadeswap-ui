import { FC } from 'react';
import { useSelector } from 'react-redux';
import { selectScreeMode } from '../../state/common/selectors';
import HeaderDesktop from './Header';
import HeaderMobile from './mobile/Header';
import { ScreenTypes } from '../../state/common/types';
import { useWallet } from '@solana/wallet-adapter-react';

const Header: FC = () => {
  const { connected, publicKey, disconnect } = useWallet();
  const screenMode = useSelector(selectScreeMode);
  return screenMode !== ScreenTypes.DESKTOP ? (
    <HeaderMobile
      connected={connected}
      publicKey={publicKey}
      disconnect={disconnect}
    />
  ) : (
    <HeaderDesktop
      connected={connected}
      publicKey={publicKey}
      disconnect={disconnect}
    />
  );
};

export default Header;
