import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { SocialTypeEnum } from '@/common/enums';
import { BaseUuidEntity } from '../BaseUuidEntity';

@Entity({ name: 'user_socials' })
@Index(['userId'])
@Unique(['socialType', 'socialId'])
export class UserSocialEntity extends BaseUuidEntity {
  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @Column({
    type: 'enum',
    enum: Object.values(SocialTypeEnum),
    nullable: false,
  })
  socialType: SocialTypeEnum;

  @Column({ nullable: false })
  socialId: string;

  @Column({ type: 'text', nullable: false })
  accessToken: string;

  @Column({ nullable: true })
  refreshToken?: string;

  @Column({ nullable: true })
  expiredAt?: Date;

  @Column({ nullable: true })
  refreshTokenExpiredAt?: Date;

  @ManyToOne(() => UserEntity, (user) => user.socials, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user?: UserEntity;
}
