import {Injectable} from '@nestjs/common';
import {DataSource} from 'typeorm';
import { UserEntity } from '../../entities';
import { UuidRepository } from '../UuidRepository';

@Injectable()
export class UserRepository extends UuidRepository<UserEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async findOneByUsername(username: string): Promise<UserEntity | null> {
    return this.createQueryBuilder("user")
      .where("LOWER(user.username) = LOWER(:username)", { username })
      .getOne();
  }  

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    return this.findOneBy({ email });
  }
}
