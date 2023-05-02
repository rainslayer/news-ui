import { FormEvent, useContext, useState } from "react";
import { HttpClient } from "../utils/httpClient";
import { ERoutes } from "../const/routes";
import { RouterContext } from "../context/router";
import { useUser } from "../hooks/useUser";

export function LoginPage() {
  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const {route, redirectTo} = useContext(RouterContext);
  const [,, getUserData] = useUser();
  const isSignInPage = route === ERoutes.SignIn;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    let res;

    if (isSignInPage) {
      res = await HttpClient.signIn({login, password});
    } else {
      res = await HttpClient.signUp({login, password});
    }

    const json = await res.json();

    if (!res.ok) {
      setError(json.message);
    } else {
      setError(null);
      await getUserData();
      redirectTo(ERoutes.News);
    }
  }

  function generateStyles() {
    const className = ["login_block"];

    if (error) {
      className.push("login_block--error")
    }

    return className.join(' ');
  }

  return (
    <div className={generateStyles()}>
    <h1>{`Sign ${isSignInPage ? "In" : "Up"}`}</h1>
    <form onSubmit={handleSubmit}>
      <label htmlFor="login">Login</label>
      <input id="login" value={login} onChange={(event) => setLogin(event.target.value)}/>
      <label htmlFor="password">Password</label>
      <input id="password" type="password"  value={password} onChange={(event) => setPassword(event.target.value)}/>
      <button
        type="submit"
        disabled={!login.length || !password.length}>
      {isSignInPage ? "Sign in" : "Sign up"}
      </button>
    </form>
    {error && <span className="error_message">{error}</span>}
    {isSignInPage && <span>No account? Register <a href={`${ERoutes.SignUp}`}>here</a></span>}
    {!isSignInPage && <span>Already registered? Login <a href={`${ERoutes.SignIn}`}>here</a></span>}
  </div>);
}
