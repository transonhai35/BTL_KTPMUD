import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserOtpEntity } from '../../entities';
import { UuidRepository } from '../UuidRepository';

@Injectable()
export class UserOtpRepository extends UuidRepository<UserOtpEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserOtpEntity, dataSource.createEntityManager());
  }
}
