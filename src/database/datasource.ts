import { DataSource, DataSourceOptions } from 'typeorm';
import configuration from 'src/config/configuration';

const config = configuration();

export const dataSourceOptions: DataSourceOptions = {
  type: config.db.type as any,
  host: config.db.host || 'mysql',
  port: parseInt(config.db.port) || 3306,
  username: config.db.username || 'root',
  password: config.db.password || '',
  database: config.db.database || 'country_api',
  synchronize: false,
  logging: false,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: [__dirname + '/../database/migrations/*.{js, ts}'],
};
export const dataSource: DataSource = new DataSource(dataSourceOptions);
