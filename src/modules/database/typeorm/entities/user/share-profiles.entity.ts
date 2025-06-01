import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { BaseUuidEntity } from "../BaseUuidEntity";
import { UserEntity } from "./user.entity";
import { ShareProfileStatus } from "@/common/enums/share-profile-status.enum";

@Entity('share_profiles')
export class ShareProfileEntity extends BaseUuidEntity {
  @Column({ type: 'uuid' }) 
  ownerId: string;

  @Column({ type: 'uuid', nullable: true })
  viewerId?: string | null;

  @ManyToOne(() => UserEntity, (user) => user.ownerProfiles)
  @JoinColumn({ name: 'ownerId' })
  owner: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.viewedProfiles, { nullable: true })
  @JoinColumn({ name: 'viewerId' })
  viewer?: UserEntity | null;

  @Column({ type: 'varchar' }) 
  viewerEmail: string;

  @Column({ type: 'enum', enum: ShareProfileStatus, default: ShareProfileStatus.PENDING })
  status: ShareProfileStatus;
}
