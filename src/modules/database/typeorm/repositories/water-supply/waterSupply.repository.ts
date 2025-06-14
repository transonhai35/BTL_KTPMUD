import { DataSource } from "typeorm";
import { Injectable } from "@nestjs/common";
import { WaterSupplyEntity } from '../../entities/water-supply';
import { UuidRepository } from '..';

@Injectable()
export class WaterSupplyRepository extends UuidRepository<WaterSupplyEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(WaterSupplyEntity, dataSource.createEntityManager());
  }
}
