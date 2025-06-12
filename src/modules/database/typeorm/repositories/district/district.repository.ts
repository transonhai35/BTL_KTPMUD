import {Injectable} from '@nestjs/common';
import {DataSource} from 'typeorm';
import { UuidRepository } from '../UuidRepository';
import { DistrictEntity } from '../../entities/district';

@Injectable()
export class DistrictRepository extends UuidRepository<DistrictEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(DistrictEntity, dataSource.createEntityManager());
  }
}
