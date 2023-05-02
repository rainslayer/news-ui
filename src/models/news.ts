import { IUser } from "./user";
import { IFile } from "./file";

export interface INews {
  _id: string;
  content: string;
  attachments: IFile[];
  author: IUser;
  createdAt: string;
}
