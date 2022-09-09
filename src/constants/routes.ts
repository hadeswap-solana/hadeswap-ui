import { FC } from 'react';

import { PATHS } from './paths';
import { Home } from '../pages/HomePage/Home';
import { Page404 } from '../pages/Page404/Page404';
import { Collections } from '../pages/Collections/Collections';
import { CollectionBuy, CollectionSell } from '../pages/Collection/Collection';
import { MyNfts } from '../pages/MyNfts/MyNfts';
import { MyPools } from '../pages/MyPools/MyPools';
import { CollectionPoolsPage } from '../pages/Collection/CollectionPoolsPage';
import { PoolPage } from '../pages/Pool/PoolPage';
import { NewPool } from '../pages/NewPool/NewPool';
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
    path: PATHS.COLLECTION_BUY,
    component: CollectionBuy,
  },
  {
    exact: true,
    path: PATHS.COLLECTION_SELL,
    component: CollectionSell,
  },
  {
    exact: true,
    path: PATHS.COLLECTION_POOLS,
    component: CollectionPoolsPage,
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
    component: NewPool,
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
