import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { SMALL_SCREEN_SIZE, TABLET_SIZE } from '../constants/common';
import { ScreenTypes } from '../state/common/types';
import { commonActions } from '../state/common/actions';
import { throttle } from 'lodash';

export const useDesktopMode = (): void => {
  const dispatch = useDispatch();

  const setMobileMode = useCallback((): void => {
    if (window.screen.width <= TABLET_SIZE) {
      dispatch(commonActions.setScreenMode(ScreenTypes.TABLET));
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    } else if (window.screen.width <= SMALL_SCREEN_SIZE) {
      dispatch(commonActions.setScreenMode(ScreenTypes.SMALL_SCREEN));
    } else {
      dispatch(commonActions.setScreenMode(ScreenTypes.DESKTOP));
    }
  }, [dispatch]);

  setMobileMode();

  useEffect(() => {
    const resizeThrottled = throttle(setMobileMode, 300);
    window.addEventListener('resize', resizeThrottled);
    return () => {
      window.removeEventListener('resize', resizeThrottled);
    };
  }, [setMobileMode]);
};
