import { DataSource, DataSourceOptions } from 'typeorm';
import configuration from 'src/config/configuration';

const config = configuration();

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: config.db.host || '127.0.0.1',
  port: parseInt(config.db.port) || 3307,
  username: config.db.username || 'root',
  password: config.db.password || '',
  database: config.db.database || 'country_api',
  synchronize: false,
  logging: false,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: [__dirname + '/../database/migrations/*.{js, ts}'],
};
export const dataSource: DataSource = new DataSource(dataSourceOptions);
