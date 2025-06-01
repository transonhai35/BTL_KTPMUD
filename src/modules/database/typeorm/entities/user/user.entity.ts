import { Exclude } from 'class-transformer';
import bcrypt from 'bcryptjs';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  OneToMany,
} from 'typeorm';
import randomize from 'randomatic';
import { AccountTypeEnum, NetWorthRankEnum, RoleTypeEnum } from '@/common/enums';
import { isPasswordHashed } from '@/utils/passwd';
import { UserSocialEntity } from './user-social.entity';
import { BaseUuidEntity } from '../BaseUuidEntity';
import { ShareProfileEntity } from './share-profiles.entity';

@Entity({ name: 'users' })
@Index(['username'], { unique: true })
@Index(['email'], { unique: true })
export class UserEntity extends BaseUuidEntity {
  @Column({ type: 'varchar', nullable: true })
  name?: string;

  @Column({ nullable: true, unique: true })
  code?: string;

  @Column({ type: 'varchar', nullable: true })
  dateOfBirth?: string;

  @Column({ type: 'varchar', length: 32, nullable: true, unique: true })
  email?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 64, nullable: true, unique: true })
  username?: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string;

  @Column({ type: 'bool', nullable: true })
  emailVerified?: boolean;

  @Column({ type: 'bool', nullable: true })
  phoneVerified?: boolean;

  @Column({ type: 'varchar', nullable: true })
  avatar?: string;

  @Column({ type: 'varchar', nullable: true, default: RoleTypeEnum.Guest })
  role?: RoleTypeEnum;

  @Column({ type: 'enum', enum: AccountTypeEnum, default: AccountTypeEnum.User })
  type: AccountTypeEnum;

  @Column({ type: 'enum', enum: NetWorthRankEnum, nullable: true, default: NetWorthRankEnum.AMBER })
  rank: NetWorthRankEnum;

  @Column({ type: 'bool', nullable: true, default: false })
  isTest?: boolean;

  @Column({ type: 'bool', nullable: true, default: false })
  activated?: boolean;

  @Column({ type: 'int', default: 0 })
  failedLoginAttempts: number;

  @Column({ type: 'timestamp', nullable: true })
  lastFailedAttempt: Date;

  @OneToMany(() => UserSocialEntity, (userSocial) => userSocial.user)
  socials?: UserSocialEntity[];

  @Column({ type: 'text', nullable: true })
  about?: string;

  @Column({ type: 'uuid', nullable: true })
  countryId?: string;

  // User's legal information
  @Column({ type: 'varchar', nullable: true })
  portraitImage?: string;

  @Column({ type: 'varchar', nullable: true })
  idCardFront?: string;

  @Column({ type: 'varchar', nullable: true })
  idCardBack?: string;

  @Column({ type: 'varchar', nullable: true })
  socialSecurityNumber?: string;

  @OneToMany(() => ShareProfileEntity, (shareProfile) => shareProfile.owner, { cascade: true })
  ownerProfiles: ShareProfileEntity[];

  @OneToMany(() => ShareProfileEntity, (shareProfile) => shareProfile.viewer, { cascade: true })
  viewedProfiles: ShareProfileEntity[];

  @BeforeInsert()
  private setCode() {
    if (!this.code) {
      switch (this.type) {
        case AccountTypeEnum.Business:
          this.code = 'B' + randomize('0', 9);
          break;
        default:
          this.code = 'U' + randomize('0', 9);
      }
    }   
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !isPasswordHashed(this.password)) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  checkPassword(passwd: string) {
    return bcrypt.compareSync(passwd, this.password);
  }

  hasPassword(): boolean {
    return !!this.password;
  }

  getUsername() {
    if (this.username) return this.username.toLowerCase();
    return this.username;
  }
}
