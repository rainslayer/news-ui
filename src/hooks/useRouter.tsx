import {useEffect, useState} from "react";
import {ERoutes, routes} from "../const/routes";

export function useRouter() {
  const [route, setRoute] = useState<string>(window.location.pathname);
  const { pathname } = window.location;

  useEffect(() => {
    if (!routes.includes(pathname)) {
      redirectTo(ERoutes.Root);
    }
  }, [pathname])

  function redirectTo(newRoute: ERoutes) {
    if (route === newRoute) {
      return;
    }

    window.history.pushState("", "", newRoute);
    setRoute(newRoute);
  }

  return [route, redirectTo] as const;
}
