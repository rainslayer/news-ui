import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { ViewControl } from "./ViewControl";
import { EViewType } from "../const/enums";
import { NewsFormatter } from "./NewsFormatter";
import { HttpClient } from "../utils/httpClient";
import { IFile } from "../models/file";
import { AttachedFiles } from "./AttachedFiles";
import { INews } from "../models/news";
import { getLocalDateTime } from "../utils/getLocalDateTime";

interface IComponentProps {
  setNews: Dispatch<SetStateAction<INews[]>>;
  editedNews: INews | null;
  setEditedNews: Dispatch<SetStateAction<INews | null>>;
}

export function NewsEditor({ setNews, editedNews, setEditedNews }: IComponentProps) {
  const [view, setView] = useState<EViewType>(EViewType.Collapsed);
  const [content, setContent] = useState<string>("");
  const [attachments, setAttachments] = useState<Array<IFile>>([]);
  const [delayedPost, setDelayedPost] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const isEditorShown = view !== EViewType.Collapsed;
  const editingExistingNews = editedNews !== null;

  useEffect(() => {
    if (editingExistingNews) {
      setView(EViewType.Editor);
      setContent(editedNews?.content);
      setAttachments(editedNews?.attachments);
      setDelayedPost(getLocalDateTime(new Date(editedNews?.createdAt)));
    }
  }, [editingExistingNews])

  useEffect(() => {
    if (view === EViewType.Preview && ref.current) {
      ref.current.innerHTML = content;
    }
  }, [view])

  async function createNews() {
    const body = {
      content,
      attachments: attachments.map(a => a._id),
      ...(delayedPost && {createdAt: delayedPost})
    };

    if (editingExistingNews) {
      await HttpClient.editNews({...body, _id: editedNews?._id});
    } else {
      const res = await HttpClient.createNews(body).then(data => data.json());
      if (new Date(res.createdAt) <= new Date()) {
        setNews((prevState: Array<INews>) => [res, ...prevState])
      }
    }

    setContent("");
    setAttachments([]);
    setView(EViewType.Collapsed);
    setDelayedPost(null);
    setEditedNews(null);
  }

  function handleOnFocus() {
    if (!isEditorShown) {
      setView(EViewType.Editor);
    }
  }

  function renderView() {
    if (view === EViewType.Editor || !isEditorShown) {
      return <textarea
        value={content}
        onChange={event => setContent(event.target.value)}
        placeholder="Start typing"
        rows={isEditorShown ? 10 : 1}
        onFocus={handleOnFocus}
      />;
    }

    return <span className="news_preview" ref={ref}>{content}</span>
  }

  function handleDelayedPost(event: ChangeEvent<HTMLInputElement>) {
    setDelayedPost(getLocalDateTime(new Date(event.target.value)));
  }

  return <div className="create_news_block">
    {isEditorShown && <ViewControl view={view} setView={setView}/>}
    {renderView()}
    <div className="create_news_footer">
      {view === EViewType.Editor && <NewsFormatter setContent={setContent} setAttachments={setAttachments} />}
      <div className="create_news_footer__management">

        {view === EViewType.Editor && <button className="footer_button" onClick={() => setView(EViewType.Collapsed)}>▲</button>}
        {isEditorShown && <button className="footer_button" onClick={createNews} disabled={!content.length}>
          {editingExistingNews ? "Edit" : "Publish"}
        </button>}
      </div>
    </div>
    {view === EViewType.Editor &&
      <div id="delayed_post__block">
        <label htmlFor="delayed_post">Delay post till: </label>
        <input
          id="delayed_post"
          type="datetime-local"
          min={getLocalDateTime()}
          onChange={handleDelayedPost}
          value={delayedPost ?? ""}
        />
      </div>
    }
    {isEditorShown && attachments.length > 0 && <AttachedFiles attachments={attachments} setAttachments={setAttachments} />}
  </div>
}
