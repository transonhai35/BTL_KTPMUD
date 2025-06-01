import axios, { AxiosInstance, AxiosResponse } from "axios";
import { IAuthFactory } from "../interfaces/IAuthFactory";
import { IUser } from "../interfaces/IUser";

interface IUserInfo {
  id: string;
  name: string;
  email?: string;
  picture?: {
    data?: {
      url?: string
    }
  };
  birthday?: string;
}

export class FacebookAuthFactory implements IAuthFactory {

  private readonly http: AxiosInstance;

  constructor(){
    this.http = axios.create({
      baseURL: 'https://graph.facebook.com/v3.2'
    });
  }

  async getUserInfo(token: string): Promise<IUser> {
    const result: AxiosResponse<IUserInfo> = await this.http.get('/me', {
      params: {
        fields: 'id,name,email,picture.type(large),gender,address,birthday',
        access_token: token
      }
    });
    const { id, email, name, picture, birthday } = result.data;
    return { id, email, name, avatar: picture?.data?.url, birthday };
  }

}