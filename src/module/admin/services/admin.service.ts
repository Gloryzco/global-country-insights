import { Injectable } from '@nestjs/common';
import { ICountry } from 'src/module/countryApi';
import { RedisService } from 'src/module/redis';
import { AxiosHelper, QueryBuilderService } from 'src/shared';

@Injectable()
export class AdminService {
  constructor(
    private readonly redisService: RedisService,
    private readonly queryBuilder: QueryBuilderService,
  ) {}

  

  private getApiUrl(queryDto: any): string {
    return 'https://api.example.com/countries';
  }
}
