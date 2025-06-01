import axios, { AxiosInstance, AxiosResponse } from "axios";
import { IAuthFactory } from "../interfaces/IAuthFactory";
import { IUser } from "../interfaces/IUser";

interface IUserInfo {
  id: string;
  name: string;
  email?: string;
  picture?: string;
  birthday?: string;
}

export class GoogleAuthFactory implements IAuthFactory {

  private readonly http: AxiosInstance;

  constructor(){
    this.http = axios.create({
      baseURL: 'https://www.googleapis.com/oauth2/v2'
    });
  }

  async getUserInfo(token: string): Promise<IUser> {
    const result: AxiosResponse<IUserInfo> = await this.http.get('/userinfo', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const { id, email, name, picture, birthday } = result.data;
    return { id, email, name, avatar: picture, birthday };
  }

}