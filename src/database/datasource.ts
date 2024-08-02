import { DataSource, DataSourceOptions } from 'typeorm';
import configuration from 'src/config/configuration';

const config = configuration();

export const dataSourceOptions: DataSourceOptions = {
  type: config.db.type as any,
  host: config.db.host,
  port: parseInt(config.db.port),
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,
  synchronize: false,
  logging: false,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: [__dirname + '/../database/migrations/*.{js, ts}'],
};
export const dataSource: DataSource = new DataSource(dataSourceOptions);
