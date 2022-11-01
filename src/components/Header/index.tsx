import { FC } from 'react';
import { useSelector } from 'react-redux';
import { selectScreeMode } from '../../state/common/selectors';
import HeaderDesktop from './Header';
import HeaderMobile from './mobile/Header';
import { ScreenTypes } from '../../state/common/types';

const Header: FC = () => {
  const screenMode = useSelector(selectScreeMode);
  return screenMode !== ScreenTypes.DESKTOP ? (
    <HeaderMobile />
  ) : (
    <HeaderDesktop />
  );
};

export default Header;
