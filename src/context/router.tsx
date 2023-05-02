import { createContext } from 'react';
import { ERoutes } from "../const/routes";

interface IRouterContext {
  route: string;
  redirectTo: (route: ERoutes) => void;
}

export const RouterContext = createContext<IRouterContext>({
  route: '/',
  redirectTo: (route: ERoutes) => {},
});
