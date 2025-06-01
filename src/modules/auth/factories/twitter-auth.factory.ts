import axios, { AxiosInstance, AxiosResponse } from "axios";
import { IAuthFactory } from "../interfaces/IAuthFactory";
import { IUser } from "../interfaces/IUser";

interface ITwitterUserInfo {
  id: string;
  name: string;
  username: string;
  profile_image_url?: string;
}

export class TwitterAuthFactory implements IAuthFactory {
  private readonly http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: 'https://api.twitter.com/2'
    });
  }

  async getUserInfo(token: string): Promise<IUser> {
    const result: AxiosResponse<{ data: ITwitterUserInfo }> = await this.http.get('/users/me', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        'user.fields': 'id,name,username,profile_image_url'
      }
    });
    const { id, name, profile_image_url, username } = result.data.data;
    return { id, name, avatar: profile_image_url, email: undefined, username };
  }
}
