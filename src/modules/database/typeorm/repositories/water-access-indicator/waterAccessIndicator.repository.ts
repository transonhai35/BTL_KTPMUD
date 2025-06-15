import { DataSource } from "typeorm";
import { UuidRepository } from "../UuidRepository";
import { Injectable } from "@nestjs/common";
import { WaterAccessIndicatorEntity } from '../../entities/water-access-indicator';

@Injectable()
export class WaterAccessIndicatorRepository extends UuidRepository<WaterAccessIndicatorEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(WaterAccessIndicatorEntity, dataSource.createEntityManager());
  }
}




