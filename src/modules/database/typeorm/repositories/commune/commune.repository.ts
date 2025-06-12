import {Injectable} from '@nestjs/common';
import {DataSource} from 'typeorm';
import { UserEntity } from '../../entities';
import { UuidRepository } from '../UuidRepository';
import { CommuneEntity } from '../../entities/commune';

@Injectable()
export class CommuneRepository extends UuidRepository<CommuneEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(CommuneEntity, dataSource.createEntityManager());
  }

}
