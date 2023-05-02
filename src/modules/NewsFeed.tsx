import ReactPaginate from "react-paginate";
import { INews } from "../models/news";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import { HttpClient } from "../utils/httpClient";
import { NewsComponent } from "../components/NewsComponent";
import { NewsAlert } from "../components/NewsAlert";
import { EManagementOptions } from "../const/enums";

interface IComponentProps {
  news: Array<INews>;
  setNews: Dispatch<SetStateAction<INews[]>>;
  setEditedNews: Dispatch<SetStateAction<INews | null>>;
}

export function NewsFeed({ news, setNews, setEditedNews }: IComponentProps) {
  const [pageCount, setPageCount] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const perPage = 10;

  async function getNews() {
    const news = await HttpClient.getNews({
      page: currentPage,
      limit: perPage
    }).then(data => data.json());
    setNews(news.news);
    setPageCount(Math.round(news.count / perPage));
  }

  useEffect(() => {
    (async () => {
      await getNews();
    })();
  }, [currentPage])

  function handlePageChange({ selected }: any) {
    setCurrentPage(selected + 1);
  }

  async function handleSocketMessage() {
    setCurrentPage(1);
    await getNews();
  }

  async function handleNewsManagemenet(event: ChangeEvent<HTMLSelectElement>, news: INews) {
    switch(event.target.value) {
      case EManagementOptions.Delete:
        await HttpClient.deleteNews(news._id);
        setNews((prevState: Array<INews>) => {
          return prevState.filter((n: INews) => n._id !== news._id);
        })
        break;
      case EManagementOptions.Edit:
        setEditedNews(JSON.parse(JSON.stringify(news)));
        break;
      default:
        return;
    }
  }

  return (<>
    <NewsAlert handleSocketMessage={handleSocketMessage} />
    {news?.length > 0 && news.map((news: INews) =>
      <NewsComponent key={news._id} news={news} handleNewsManagemenet={handleNewsManagemenet} />)}
    {pageCount > 1 && <ReactPaginate
      className="news_pagination"
      breakLabel="..."
      onPageChange={handlePageChange}
      nextLabel={<button>{">"}</button>}
      pageRangeDisplayed={perPage}
      pageCount={pageCount}
      pageLabelBuilder={page => (page !== currentPage) && <button>{page}</button>}
      previousLabel={<button>{"<"}</button>}
    />}
  </>);
}
