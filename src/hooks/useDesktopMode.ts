import { useDispatch } from 'react-redux';
import {
  DESKTOP,
  SMALL_SCREEN,
  SMALL_SCREEN_SIZE,
  TABLET,
  TABLET_SIZE,
} from '../constants/common';
import { commonActions } from '../state/common/actions';
import { useEffect } from 'react';
import { throttle } from 'lodash';

export const useDesktopMode = () => {
  const dispatch = useDispatch();

  const setMobileMode = (): void => {
    if (window.screen.width <= TABLET_SIZE) {
      dispatch(commonActions.setScreenMode(TABLET));
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    } else if (window.screen.width <= SMALL_SCREEN_SIZE) {
      dispatch(commonActions.setScreenMode(SMALL_SCREEN));
    } else {
      dispatch(commonActions.setScreenMode(DESKTOP));
    }
  };

  setMobileMode();

  useEffect(() => {
    const resizeThrottled = throttle(setMobileMode, 300);
    window.addEventListener('resize', resizeThrottled);
    return () => {
      window.removeEventListener('resize', resizeThrottled);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
