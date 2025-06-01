import { DataSource } from "typeorm";
import { ShareProfileEntity } from "../../entities/user/share-profiles.entity";
import { UuidRepository } from "../UuidRepository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ShareProfileRepository extends UuidRepository<ShareProfileEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ShareProfileEntity, dataSource.createEntityManager());
  }
}
