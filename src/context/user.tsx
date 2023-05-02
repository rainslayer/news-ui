import { createContext } from 'react';
import { IUser } from "../models/user";

export const UserContext = createContext<IUser | null>(null);
