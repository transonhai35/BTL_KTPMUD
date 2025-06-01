import {Injectable} from '@nestjs/common';
import {DataSource} from 'typeorm';
import { UserSocialEntity } from '../../entities';
import { UuidRepository } from '../UuidRepository';

@Injectable()
export class UserSocialRepository extends UuidRepository<UserSocialEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserSocialEntity, dataSource.createEntityManager());
  }
}
