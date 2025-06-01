import {Type, instanceToPlain} from 'class-transformer';
import {validateOrReject} from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity as TypeOrmBaseEntity,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity extends TypeOrmBaseEntity {
  @PrimaryGeneratedColumn({type: 'bigint', unsigned: true})
  @Type(() => Number)
  id: number;

  @CreateDateColumn({nullable: true})
  createdAt: Date;

  @UpdateDateColumn({nullable: true})
  updatedAt: Date;


  @BeforeInsert()
  @BeforeUpdate()
  protected beforeSave() {
    return validateOrReject(this);
  }

  toObject() {
    return instanceToPlain(this);
  }
}
