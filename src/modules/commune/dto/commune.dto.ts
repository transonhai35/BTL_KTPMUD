import { Expose, plainToInstance } from 'class-transformer';
import { CommuneEntity } from '../../database/typeorm/entities/commune';

export class CommuneDto {
  @Expose()
  id: string;

  @Expose()
  code: string;

  @Expose()
  name: string;

    constructor(props: Partial<CommuneEntity>) {
      return plainToInstance(CommuneDto, props, {
        excludeExtraneousValues: true,
        exposeUnsetFields: false,
      });
    }
}