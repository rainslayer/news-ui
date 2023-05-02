import React, { useContext, useState } from 'react';
import useWebSocket from "react-use-websocket";
import { EnvVars } from "../const/envVars";
import { UserContext } from "../context/user";

interface IComponentProps {
  handleSocketMessage: () => void,
}

export function NewsAlert({ handleSocketMessage }: IComponentProps) {
  const [newNewsCount, setNewNewsCount] = useState<number>(0);
  const user = useContext(UserContext);

  useWebSocket(EnvVars.wssPath, {
    onMessage: (m) => {
      const { message, author } = JSON.parse(m.data);
      if (message === "NEW_NEWS" && author !== user?.login) {
        setNewNewsCount((prevState: number) => prevState + 1)
      }
    }
  });

  async function handleUpdateFeed() {
    await handleSocketMessage();
    setNewNewsCount(0);
  }

  if (newNewsCount === 0) {
    return <></>;
  }

  return (
    <button className="news_alert" onClick={handleUpdateFeed}>
      <span>{newNewsCount} new news</span>
    </button>
  );
}
