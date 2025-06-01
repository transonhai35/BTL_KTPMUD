import { BeforeInsert, Column, Entity, Index } from 'typeorm';
import { OTPSenderTypeEnum, OTPTypeEnum } from '@/common/enums';
import { randString } from '@/utils/random';
import { BaseUuidEntity } from '../BaseUuidEntity';

@Entity({ name: 'user_otps' })
@Index(['userId', 'type', 'code', 'token'])
export class UserOtpEntity extends BaseUuidEntity {
  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @Column({
    type: 'enum',
    enum: Object.values(OTPSenderTypeEnum),
    nullable: false,
    default: OTPSenderTypeEnum.Email,
  })
  senderType: OTPSenderTypeEnum;

  @Column({ type: 'enum', enum: Object.values(OTPTypeEnum), nullable: false })
  type: OTPTypeEnum;

  @Column({ nullable: false })
  code: string;

  @Column({ nullable: false })
  receiver: string; // email or phone

  @Column({ nullable: false })
  token: string;

  @Column({ nullable: false })
  expiredAt: Date;

  @Column({ type: 'bool', nullable: false, default: false })
  isVerified: boolean;

  @Column({ type: 'int', default: 0 })
  failedVerifyAttempts: number;

  @BeforeInsert()
  private setToken() {
    if (!this.code) {
      this.code = randString(32);
    }
  }

  isExpired() {
    return this.expiredAt.getTime() < Date.now();
  }
}
