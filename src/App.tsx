import React, {useEffect} from 'react';
import {LoginPage} from "./pages/LoginPage";
import {UserContext} from "./context/user";
import {useRouter} from "./hooks/useRouter";
import {useUser} from "./hooks/useUser";
import {ERoutes} from "./const/routes";
import {NewsPage} from "./pages/NewsPage";
import {RouterContext} from "./context/router";

function App() {
  const [route, redirectTo] = useRouter();
  const [user, status, getUserData] = useUser();

  useEffect(() => {
    if (route === ERoutes.Root) {
      (async () => {
        await getUserData();

        if (user) {
          redirectTo(ERoutes.News);
        } else {
          redirectTo(ERoutes.SignIn);
        }
      })();
    }
  }, [route])

  useEffect(() => {
    if (status === "pending") {
      return;
    }

    if (user === null ) {
      if (route !== ERoutes.SignIn && route !== ERoutes.SignUp) {
        redirectTo(ERoutes.SignIn);
      }
    } else {
      redirectTo(ERoutes.News);
    }
  }, [user, status])

  function renderPage() {
    switch (route) {
      case ERoutes.SignIn:
      case ERoutes.SignUp:
        return <LoginPage />;
      case ERoutes.News:
        return <NewsPage />;
      default:
        return null;
    }
  }

  if (status === "pending") {
    return null;
  }

  return (
    <RouterContext.Provider value={{route, redirectTo}}>
      <UserContext.Provider value={user}>
        {renderPage()}
      </UserContext.Provider>
    </RouterContext.Provider>
  )
}

export default App;
