import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { IAuthFactory } from '../interfaces/IAuthFactory';
import { IUser } from '../interfaces/IUser';
import { instagramConfig } from '../../../config';

interface IUserInfo {
  id: string;
  username: string;
  profile_picture_url?: string;
  name: string;
  followers_count: number;
}

export class InstagramAuthFactory implements IAuthFactory {
  private readonly http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: `https://graph.instagram.com/${instagramConfig.graphVersion}`,
    });
  }

  async getUserInfo(token: string): Promise<IUser> {
    
      const result: AxiosResponse<IUserInfo> = await this.http.get('/me', {
        params: {
          fields: 'id,username,profile_picture_url,name,followers_count',
          access_token: token,
        },
      });

      const { id, username, profile_picture_url, name, followers_count } = result.data;
      
      // Return the user info based on the IUser interface
      return {
        id,
        username: username,
        avatar: profile_picture_url,
        name,
      };
  }
}
