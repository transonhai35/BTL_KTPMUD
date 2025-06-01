import { Type, instanceToPlain } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity as TypeOrmBaseEntity,
  UpdateDateColumn,
} from 'typeorm';

export class BaseUuidEntity extends TypeOrmBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Type(() => String)
  id: string;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  protected beforeSave() {
    return validateOrReject(this);
  }

  toObject() {
    return instanceToPlain(this);
  }
}
