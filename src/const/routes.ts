export enum ERoutes {
  Root = '/',
  SignIn = "/signin",
  SignUp = "/signup",
  News = "/news"
}

export const routes: string[] = Object.values(ERoutes);
