import { Repository as BaseRepository } from 'typeorm/repository/Repository';
import { DeepPartial, FindOptionsWhere } from 'typeorm';
import { BaseUuidEntity } from '../entities/BaseUuidEntity';

export class UuidRepository<T extends BaseUuidEntity> extends BaseRepository<T> {
  /**
   * Find entity by id
   * @param id string | number
   * @returns Promise<T | null>
   */
  findById(id: string | number): Promise<T | null> {
    return this.findOneBy({ id } as FindOptionsWhere<T>);
  }

  /**
   * Create one entity
   * @param data DeepPartial<T>
   * @returns Promise<T>
   */
  store(data: DeepPartial<T>): Promise<T> {
    const entity = this.create(data);
    return this.save(entity);
  }
}
