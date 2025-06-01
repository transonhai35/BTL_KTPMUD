import { Injectable } from '@nestjs/common';
import { SocialTypeEnum } from '../../../common/enums';
import { IAuthFactory } from '../interfaces/IAuthFactory';
import { FacebookAuthFactory } from './facebook-auth.factory';
import { GoogleAuthFactory } from './google-auth.factory';
import { AppleAuthFactory } from './apple-auth.factory';
import { InstagramAuthFactory } from './instagram-auth.factory';
import { TwitterAuthFactory } from './twitter-auth.factory';
@Injectable()
export class AuthFactory {
  static create(socialType: SocialTypeEnum) {
    if (socialType == SocialTypeEnum.Google) {
      return new GoogleAuthFactory();
    } else if (socialType == SocialTypeEnum.Facebook) {
      return new FacebookAuthFactory();
    } else if (socialType == SocialTypeEnum.Apple) {
      return new AppleAuthFactory();
    } else if (socialType == SocialTypeEnum.Instagram) {
      return new InstagramAuthFactory();
    } else if (socialType == SocialTypeEnum.Twitter) {
      return new TwitterAuthFactory();
    }
    throw new Error(`Invalid socialType value ${socialType}`);
  }
}
