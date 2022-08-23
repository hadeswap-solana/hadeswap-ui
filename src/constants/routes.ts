import { FC } from 'react';

import { PATHS } from './paths';
import {HomePage} from '../pages/HomePage'
import {Page404} from '../pages/Page404'

interface Route {
  path: string;
  exact: boolean;
  component: FC;
}

export const routes: Route[] = [
  {
    exact: true,
    path: PATHS.ROOT,
    component: HomePage,
  },
  {
    exact: true,
    path: PATHS.PAGE_404,
    component: Page404,
  },
  {
    exact: true,
    path: '*',
    component: Page404,
  },
];
