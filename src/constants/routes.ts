import { FC } from 'react';

import { PATHS } from './paths';
import { Home } from '../pages/HomePage/Home';
import { Page404 } from '../pages/Page404/Page404';
import { Collections } from '../pages/Collections/Collections';
import { CollectionPage } from '../pages/Collection/CollectionPage';
import { MyNfts } from '../pages/MyNfts/MyNfts';
import { MyPools } from '../pages/MyPools/MyPools';
import { PoolPage } from '../pages/Pool/PoolPage';
import { CreatePool } from '../pages/CreatePool';
import { EditPool } from '../pages/EditPool/EditPool';

interface Route {
  path: string;
  exact: boolean;
  component: FC;
}

export const routes: Route[] = [
  {
    exact: true,
    path: PATHS.ROOT,
    component: Home,
  },
  {
    exact: true,
    path: PATHS.COLLECTIONS,
    component: Collections,
  },
  {
    exact: true,
    path: PATHS.COLLECTION,
    component: CollectionPage,
  },
  {
    exact: true,
    path: PATHS.POOL_PAGE,
    component: PoolPage,
  },
  {
    exact: true,
    path: PATHS.MY_NFTS,
    component: MyNfts,
  },
  {
    exact: true,
    path: PATHS.MY_POOLS,
    component: MyPools,
  },
  {
    exact: true,
    path: PATHS.CREATE_POOL,
    component: CreatePool,
  },
  {
    exact: true,
    path: PATHS.POOL_EDIT,
    component: EditPool,
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
