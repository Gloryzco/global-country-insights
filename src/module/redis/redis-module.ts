import { Module } from '@nestjs/common';
import { RedisService } from './service';
import { RedisClientProvider, redisClientFactory } from './repository';

@Module({
  providers: [RedisService, RedisClientProvider, redisClientFactory],
  exports: [RedisService, RedisClientProvider],
})
export class RedisModule {}
