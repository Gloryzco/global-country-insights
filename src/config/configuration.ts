import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

const config: ConfigService = new ConfigService();

export default () => ({
  app: {
    name: config.get<string>('APP_NAME'),
    port: config.get<number>('APP_PORT') || 3000,
    debug: config.get<string>('APP_DEBUG') || 'false',
    timeout: config.get<string>('TIMEOUT_IN_MILLISECONDS') || '180000',
    timezone: config.get<string>('APP_TIMEZONE'),
    url: config.get<string>('API_URL'),
    origin: config.get<string>('API_URL'),
  },

  db: {
    type: config.get<string>('DB_TYPE'),
    host: config.get<string>('DB_HOST'),
    port: config.get<string>('DB_PORT'),
    username: config.get<string>('DB_USER'),
    password: config.get<string>('DB_PASSWORD'),
    database: config.get<string>('DB_NAME'),
    autoLoadEntities: config.get<string>('DB_AUTO_LOAD_ENTITIES'),
    synchronize: config.get<string>('DB_SYNCHRONIZE'),
  },

  redis: {
    host: config.get<any>('REDIS_HOST'),
    port: config.get<number>('REDIS_PORT'),
  },

  jwt: {
    accessTokenSecret: config.get<string>('ACCESS_TOKEN_SECRET'),
    refreshTokenSecret: config.get<string>('REFRESH_TOKEN_SECRET'),
    accessTokenExpiration: config.get<string>('ACCESS_TOKEN_EXPIRATION'),
    refreshTokenExpiration: config.get<string>('REFRESH_TOKEN_EXPIRATION'),
  },

  swagger: {
    username: config.get<string>('SWAGGER_USERNAME'),
    password: config.get<string>('SWAGGER_PASSWORD'),
  },
});
