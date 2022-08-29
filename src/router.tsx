import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { COLLECTION_TABS, PATHS } from './constants';

import { routes } from './constants/routes';
import {
  useConnectionInit,
  useAppInit,
  useWalletInit,
  // useWebSocketSubscriptions,
} from './hooks';

export const Router = (): JSX.Element => {
  useAppInit();
  useConnectionInit();
  useWalletInit();
  // useWebSocketSubscriptions();

  return (
    <BrowserRouter>
      <Switch>
        <Redirect
          from={`${PATHS.COLLECTION}/:slug`}
          to={`${PATHS.COLLECTION}/:slug/${COLLECTION_TABS.BUY}`}
          exact
        />
        {routes.map(({ exact, path, component: Component }, index) => (
          <Route
            key={index}
            exact={exact}
            path={path}
            component={() => <Component />}
          />
        ))}
      </Switch>
    </BrowserRouter>
  );
};
