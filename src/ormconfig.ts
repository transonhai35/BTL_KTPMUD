


import { DataSource } from 'typeorm';
import { ormConfig } from './config';

const options = {
  type: ormConfig.type,
  host: ormConfig.host,
  port: ormConfig.port,
  username: ormConfig.username,
  password: ormConfig.password,
  database: ormConfig.database,
  logging: true,
  entities: [
    `${__dirname}/modules/**/**.entity{.ts,.js}`,
    `${__dirname}/modules/**/**.view-entity{.ts,.js}`
  ],
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  migrationsTableName: '__migrations',
};

export const dataSource = new DataSource(options);

export default {
  ...options,
  factories: [ `${__dirname}/factories/*.factory{.ts,.js}` ],
  seeds: [ `${__dirname}/seeds/*.seed{.ts,.js}` ]
};
