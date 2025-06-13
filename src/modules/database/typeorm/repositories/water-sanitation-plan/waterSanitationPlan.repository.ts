import { DataSource } from "typeorm";
import { ShareProfileEntity } from "../../entities/user/share-profiles.entity";
import { UuidRepository } from "../UuidRepository";
import { Injectable } from "@nestjs/common";
import { WaterSanitationPlanEntity } from '../../entities/water-sanitation-plan';

@Injectable()
export class WaterSanitationPlanRepository extends UuidRepository<WaterSanitationPlanEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(WaterSanitationPlanEntity, dataSource.createEntityManager());
  }
}
