import { FC } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { routes } from './constants/routes';
import {
  useConnectionInit,
  useAppInit,
  useWalletInit,
  useScreenMode,
} from './hooks';

export const Router: FC = () => {
  useAppInit();
  useConnectionInit();
  useWalletInit();
  useScreenMode();

  return (
    <BrowserRouter>
      <Switch>
        {routes.map(({ exact, path, component: Component }, index) => (
          <Route key={index} exact={exact} path={path}>
            <Component />
          </Route>
        ))}
      </Switch>
    </BrowserRouter>
  );
};
