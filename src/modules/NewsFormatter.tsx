import { ChangeEvent, Dispatch, MouseEvent, SetStateAction } from "react";
import { imageMimeTypes } from "../const/mimetypes";
import { HttpClient } from "../utils/httpClient";
import { EnvVars } from "../const/envVars";
import { IFile } from "../models/file";

interface IComponentProps {
  setContent: Dispatch<SetStateAction<string>>;
  setAttachments: Dispatch<SetStateAction<Array<IFile>>>;
}

enum EFormat {
  H1,
  H2,
  H3,
  Paragraph,
  Bold,
  Italic,
  Quote
}

export function NewsFormatter({ setContent, setAttachments }: IComponentProps) {
  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    const format = parseInt((event.nativeEvent.target as any).value);

    switch (format) {
      case EFormat.H1:
        setContent((prevState: string) => prevState.concat("<h1></h1>"));
        break;
      case EFormat.H2:
        setContent((prevState: string) => prevState.concat("<h2></h2>"));
        break;
      case EFormat.H3:
        setContent((prevState: string) => prevState.concat("<h3></h3>"));
        break;
      case EFormat.Paragraph:
        setContent((prevState: string) => prevState.concat("<p></p>"));
        break;
      case EFormat.Bold:
        setContent((prevState: string) => prevState.concat("<b></b>"));
        break;
      case EFormat.Italic:
        setContent((prevState: string) => prevState.concat("<i></i>"));
        break;
      case EFormat.Quote:
        setContent((prevState: string) => prevState.concat("<q></q>"));
        break;
      default:
        break;
    }
  }

  async function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target;
    const uploadedFiles = [];

    if (files) {
      for (let i = 0, end = files.length; i < end; ++i) {
        const file = files.item(i);

        if (file) {
          const formData = new FormData();
          formData.append("attachment", file);
          uploadedFiles.push(HttpClient.uploadFile(formData).then((data) => data.json()));
        }
      }

      await Promise.all(uploadedFiles).then((files) => {
        files.forEach((file: IFile) => {
          if (imageMimeTypes.includes(file.mimetype)) {
            setContent((prevState: string) => prevState.concat(
              `<img src="${EnvVars.apiPath}/attachments/${file.url}" alt="${file.name}"/>`
            ));
          }

          setAttachments((prevState: Array<IFile>) => [...prevState, file]);
        })
      });
    }
  }

  return <div className="news_formatter">
    <label htmlFor="attachment">&#128206;</label>
    <input id="attachment" type="file" name="attachment" className="news_formatter__button news_formatter__button" multiple
      onChange={handleFileUpload}
    />
    <button className="news_formatter__button news_formatter__button" value={EFormat.H1} onClick={handleClick}><b>H1</b></button>
    <button className="news_formatter__button news_formatter__button" value={EFormat.H2} onClick={handleClick}><b>H2</b></button>
    <button className="news_formatter__button news_formatter__button" value={EFormat.H3} onClick={handleClick}><b>H3</b></button>
    <button className="news_formatter__button news_formatter__button" value={EFormat.Paragraph} onClick={handleClick}>P</button>
    <button className="news_formatter__button news_formatter__button" value={EFormat.Bold} onClick={handleClick}><b>B</b></button>
    <button className="news_formatter__button news_formatter__button" value={EFormat.Italic} onClick={handleClick}><i>I</i></button>
    <button className="news_formatter__button news_formatter__button" value={EFormat.Quote} onClick={handleClick}><b>„“</b></button>
  </div>
}
