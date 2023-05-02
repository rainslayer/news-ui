import { NewsEditor } from "../modules/NewsEditor";
import { NewsFeed } from "../modules/NewsFeed";
import { useState } from "react";
import { INews } from "../models/news";
import useWebSocket from "react-use-websocket";
import { EnvVars } from "../const/envVars";
import { HttpClient } from "../utils/httpClient";

export function NewsPage() {
  const [news, setNews] = useState<Array<INews>>([]);
  const [editedNews, setEditedNews] = useState<INews | null>(null);

  useWebSocket(EnvVars.wssPath, {
    onMessage: async (m) => {
      const { message, id } = JSON.parse(m.data);
      if (message === "NEWS_DELETED") {
        setNews((prevState: Array<INews>) => prevState.filter((news: INews) => news._id !== id));
      }
      if (message === "NEWS_EDITED") {
        const feedIndex = news.findIndex((news: INews) => news._id === id);
        
        if (feedIndex > -1) {
          const updated = await HttpClient.getNewsById(id).then(data => data.json());
          setNews((prevState: Array<INews>) => {
            prevState.splice(feedIndex, 1, updated);
            return [...prevState];
          })
        }
      }
    }
  });

  return (
    <div className="news_page">
      <div className="news_block">
        <NewsEditor setNews={setNews} editedNews={editedNews} setEditedNews={setEditedNews} />
        <NewsFeed news={news} setNews={setNews} setEditedNews={setEditedNews}/>
      </div>
    </div>);
}
