import { Injectable } from '@nestjs/common';
import { RedisClientProvider } from '../repository';

const oneDayInSeconds = 60 * 60 * 24;

@Injectable()
export class RedisService {
  constructor(private readonly redisClient: RedisClientProvider) {}

  async set(
    key: string,
    value: any,
    key_type: string = 'ValidationReference',
    expiry: number = oneDayInSeconds,
  ): Promise<void> {
    await this.redisClient
      .getRedisInstance()
      .set(`${key_type}:${key}`, JSON.stringify(value), 'EX', expiry);
  }

  async get(
    key: string,
    key_type: string = 'ValidationReference',
  ): Promise<any> {
    const validationDetails = await this.redisClient
      .getRedisInstance()
      .get(`${key_type}:${key}`);
    return JSON.parse(validationDetails);
  }

  async delete(
    key: string,
    key_type: string = 'ValidationReference',
  ): Promise<void> {
    await this.redisClient.getRedisInstance().del(`${key_type}:${key}`);
  }
}
