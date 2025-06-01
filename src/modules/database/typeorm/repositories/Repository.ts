import {Repository as BaseReposity} from 'typeorm/repository/Repository';
import {BaseEntity} from '../entities/BaseEntity';
import {DeepPartial, FindOptionsWhere} from 'typeorm';

export class Repository<T extends BaseEntity> extends BaseReposity<T> {
  /**
   * Find entity by id
   * @param id string | number
   * @returns Promise<T | null>
   */
  findById(id: string | number): Promise<T | null> {
    return this.findOneBy({id} as FindOptionsWhere<T>);
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
