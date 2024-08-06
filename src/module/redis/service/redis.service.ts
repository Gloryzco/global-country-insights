// import { Injectable } from '@nestjs/common';
// import { RedisClientProvider } from '../repository';

// const oneDayInSeconds = 60 * 60 * 24;

// @Injectable()
// export class RedisService {
//   constructor(private readonly redisClient: RedisClientProvider) {}

//   async set(
//     key: string,
//     value: any,
//     key_type: string = 'ValidationReference',
//     expiry: number = oneDayInSeconds,
//   ): Promise<void> {
//     await this.redisClient
//       .getRedisInstance()
//       .set(`${key_type}:${key}`, JSON.stringify(value), 'EX', expiry);
//   }

//   async get(
//     key: string,
//     key_type: string = 'ValidationReference',
//   ): Promise<any> {
//     const validationDetails = await this.redisClient
//       .getRedisInstance()
//       .get(`${key_type}:${key}`);
//     return JSON.parse(validationDetails);
//   }

//   async delete(
//     key: string,
//     key_type: string = 'ValidationReference',
//   ): Promise<void> {
//     await this.redisClient.getRedisInstance().del(`${key_type}:${key}`);
//   }
// }

import { Injectable, Logger } from '@nestjs/common';
import { RedisClientProvider } from '../repository';

const oneDayInSeconds = 60 * 60 * 24;

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  constructor(private readonly redisClient: RedisClientProvider) {}

  async set(
    key: string,
    value: any,
    keyType: string = 'countries',
    expiry: number = oneDayInSeconds,
  ): Promise<void> {
    try {
      const redisKey = `${keyType}:${key}`;
      await this.redisClient.getRedisInstance().set(redisKey, JSON.stringify(value), 'EX', expiry);
    } catch (error) {
      this.logger.error(`Failed to set cache for key ${key}: ${error.message}`, error.stack);
    }
  }

  async get(
    key: string,
    keyType: string = 'countries',  // Changed default to 'cache'
    pagination?:{page: number, limit: number}
  ): Promise<any> {
    try {
      const redisKey = `${keyType}:${key}`;
      const data = await this.redisClient.getRedisInstance().get(redisKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      this.logger.error(`Failed to get cache for key ${key}: ${error.message}`, error.stack);
      return null;
    }
  }

  async delete(
    key: string,
    keyType: string = 'countries',  // Changed default to 'cache'
  ): Promise<void> {
    try {
      const redisKey = `${keyType}:${key}`;
      await this.redisClient.getRedisInstance().del(redisKey);
    } catch (error) {
      this.logger.error(`Failed to delete cache for key ${key}: ${error.message}`, error.stack);
    }
  }

  // Optional: Add method to clear all cache (use with caution)
  async clearAllCache(): Promise<void> {
    try {
      const redisClient = this.redisClient.getRedisInstance();
      await redisClient.flushall();
    } catch (error) {
      this.logger.error(`Failed to clear all cache: ${error.message}`, error.stack);
    }
  }
}
