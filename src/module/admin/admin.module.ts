import { Module } from '@nestjs/common';
import { AdminController } from './controllers';
import { CountryService } from '../countryApi';
import { RedisModule, RedisService } from '../redis';
import { QueryBuilderService } from 'src/shared';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from 'src/entity';

@Module({
  imports: [RedisModule, TypeOrmModule.forFeature([Country])],
  providers: [RedisService, QueryBuilderService, CountryService],
  controllers: [AdminController],
  exports: [],
})
export class AdminModule {}
