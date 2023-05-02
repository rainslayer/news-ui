import { useEffect, useState } from "react";
import { HttpClient } from "../utils/httpClient";
import { IUser } from "../models/user";

export function useUser() {
  const [user, setUser] = useState<IUser | null>(null);
  const [status, setStatus] = useState<"pending" | "finished">("pending");

  async function getUserData() {
    setStatus("pending");

    const res = await HttpClient.getUserData();
    if (res.ok) {
      const user = await res.json();
      setUser(user);
    } else {
      setUser(null);
    }

    setStatus("finished");
  }

  useEffect(() => {
    (async () => {
      await getUserData();
    })();
  }, [])

  return [user, status, getUserData] as const;
}
