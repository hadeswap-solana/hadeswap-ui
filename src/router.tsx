import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { routes } from './constants/routes';
import {
  useConnectionInit,
  useAppInit,
  useWalletInit,
  useDesktopMode,
} from './hooks';

export const Router = (): JSX.Element => {
  useAppInit();
  useConnectionInit();
  useWalletInit();
  useDesktopMode();

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
