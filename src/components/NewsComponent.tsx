import { INews } from "../models/news";
import { ChangeEvent, useEffect, useRef } from "react";
import { useUser } from "../hooks/useUser";
import { EManagementOptions } from "../const/enums";
import { IFile } from "../models/file";
import { EnvVars } from "../const/envVars";

interface IComponentProps {
  news: INews;
  handleNewsManagemenet: (event: ChangeEvent<HTMLSelectElement>, news: INews) => void;
}

export function NewsComponent({ news, handleNewsManagemenet }: IComponentProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [user] = useUser();

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = news.content;
    }
  }, [news])

  function renderSelfNewsManagement() {
    return <select id="news_management" value="..." onChange={(event) => handleNewsManagemenet(event, news)}>
      <option value="..." hidden disabled>...</option>
      <option value={EManagementOptions.Edit}>{EManagementOptions.Edit}</option>
      <option value={EManagementOptions.Delete}>{EManagementOptions.Delete}</option>
    </select>;
  }

  return (<div className="news_container" key={news._id}>
      <div className="news_details">
        <span>Author: <b>{news.author.login}</b></span>
        <span>Date: {new Date(news.createdAt).toLocaleString()}</span>
        {news.author._id === user?._id && renderSelfNewsManagement()}
      </div>
      <p className="news_content" ref={ref}>{news.content}</p>
      {news.attachments.length > 0 && <>
        <b>List of attached files:</b>
        <ul className="news_attachments">
          {news.attachments.map((a: IFile) =>
            <li key={a._id}>
              <a href={`${EnvVars.apiPath}/attachments/${a.url}`} target="_blank" rel="noreferrer">{a.name}</a>
            </li>
          )}
        </ul>
      </>}
  </div>);
}
