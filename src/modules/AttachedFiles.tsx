import { EnvVars } from "../const/envVars";
import { IFile } from "../models/file";
import { Dispatch, SetStateAction } from "react";
import { imageMimeTypes } from "../const/mimetypes";

interface IComponentProps {
  attachments: Array<IFile>;
  setAttachments: Dispatch<SetStateAction<Array<IFile>>>;
}

export function AttachedFiles({ attachments, setAttachments }: IComponentProps) {
  function handleDeleteFile(_id: string) {
    setAttachments((prevState) => {
      return [...prevState.filter((file: IFile) => file._id !== _id)];
    })
  }

  return <div className="attached_files">
    {attachments.map((a: IFile) => {
      if (imageMimeTypes.includes(a.mimetype)) {
        return null;
      }

      return <span key={a._id} className="attached_file">
        <a href={`${EnvVars.apiPath}/attachments/${a.url}`} target="_blank" rel="noreferrer">{a.name}</a>
        <span className="attached_files__delete" onClick={() => handleDeleteFile(a._id)}>&#10060;</span>
      </span>
      }
    )}
  </div>;
}
