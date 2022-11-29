import { useSelector } from 'react-redux';

import { selectCartSiderVisible } from './../../state/common/selectors';
import { SMALL_SCREEN_SIZE, TABLET_SIZE } from './../../constants/common';
import { useWindowSize } from '../../hooks/useWindowSize';

export const getTableWidth = (): number => {
  const { width: windowWidth } = useWindowSize();
  const cartSiderVisible = useSelector(selectCartSiderVisible);

  const desktopIndentWidth = 64;
  const tabletIndentWidth = 24;
  const cardSiderWidth = 375;

  if (cartSiderVisible && windowWidth > SMALL_SCREEN_SIZE) {
    return windowWidth - cardSiderWidth;
  }

  if (windowWidth < TABLET_SIZE) return windowWidth - tabletIndentWidth;
  return windowWidth - desktopIndentWidth;
};
