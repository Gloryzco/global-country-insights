import { FactoryProvider, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';
import configuration from 'src/config/configuration';

const config = configuration();

export class RedisClientProvider implements OnModuleInit, OnModuleDestroy {
  private redisInstance: Redis | null = null;

  async onModuleInit() {
    this.redisInstance = new Redis({
      host: config.redis.host,
      port: +config.redis.port,
    });

    this.redisInstance.on('error', (e) => {
      console.error(`Redis connection failed: ${e}`);
    });

    this.redisInstance.on('connect', () => {
      console.log(`Redis Server Connected on port: ${config.redis.port}`);
    });
  }

  onModuleDestroy(): void {
    this.redisInstance.disconnect();
  }

  getRedisInstance(): Redis | null {
    return this.redisInstance;
  }
}

export const redisClientFactory: FactoryProvider<Redis> = {
  provide: 'RedisClient',
  useFactory: async (redisClientProvider: RedisClientProvider) => {
    return redisClientProvider.getRedisInstance();
  },
  inject: [RedisClientProvider],
};
