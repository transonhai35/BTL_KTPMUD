import { IUser } from "./IUser";

export interface IAuthFactory {
  getUserInfo(token: string): Promise<IUser>,
}