import { RealtimeEventEnum, SocialTypeEnum } from '../common/enums';

export type IRealtimeEvent = ISocialAccountUnlinkedEvent;
export interface IRealtimeEventBase {
  event: RealtimeEventEnum;
}

export interface ISocialAccountUnlinkedEvent extends IRealtimeEventBase {
  event: RealtimeEventEnum.SOCIAL_ACCOUNT_UNLINKED;
  data: {
    userId: string;
    socialId: string;
    socialType: SocialTypeEnum;
    metadata?: Record<string, any>;
  };
}
