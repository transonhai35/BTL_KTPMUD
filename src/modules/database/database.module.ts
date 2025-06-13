/*
https://docs.nestjs.com/modules
*/

import { ormConfig } from '@/config';
import { Global, Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import {
  CommuneRepository,
  DistrictRepository,
  UserOtpRepository,
  UserRepository,
  UserSocialRepository,
  WaterSanitationPlanRepository,
} from './typeorm';
import { ShareProfileRepository } from './typeorm/repositories/user/share-profile.repository';

const repositories = [
  // PostgresQL Repositories
  UserRepository,
  UserSocialRepository,
  UserOtpRepository,
  ShareProfileRepository,
  CommuneRepository,
  DistrictRepository,
  WaterSanitationPlanRepository,
] as Provider[];

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory() {
        return {
          type: ormConfig.type,
          host: ormConfig.host,
          port: ormConfig.port,
          username: ormConfig.username,
          password: ormConfig.password,
          database: ormConfig.database,
          logging: ormConfig.logging,
          retryDelay: 1000,
          retryAttempts: 30,
          autoLoadEntities: true,
          bigNumberStrings: false,
          entities: [
            `${__dirname}/typeorm/entities/**/*.entity{.ts,.js}`,
            `${__dirname}/typeorm/entities/**/*.view-entity{.ts,.js}`,
          ],
          synchronize: ormConfig.synchronize || false,
        };
      },
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return addTransactionalDataSource(new DataSource(options));
      },
    }),
  ],
  controllers: [],
  providers: [...repositories],
  exports: [...repositories],
})
export class DatabaseModule {}
