import { FC, memo } from 'react';
import { useSelector } from 'react-redux';
import { selectScreeMode } from '../../state/common/selectors';
import HeaderDesktop from './Header';
import HeaderMobile from './mobile/Header';
import { ScreenTypes } from '../../state/common/types';
import { DESKTOP } from '../../constants/common';

const Header: FC = () => {
  const screenMode = useSelector<ScreenTypes>(selectScreeMode);
  return screenMode !== DESKTOP ? <HeaderMobile /> : <HeaderDesktop />;
};

export default memo(Header);
