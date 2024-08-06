import { Module } from '@nestjs/common';
import { UserService } from '../user';
import { AdminService } from './services';
import { AdminController } from './controllers';
import { CountryApiModule, CountryService } from '../countryApi';
import { RedisModule, RedisService } from '../redis';
import { QueryBuilderService } from 'src/shared';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from 'src/entity';

@Module({
  imports: [RedisModule, TypeOrmModule.forFeature([Country])],
  providers: [AdminService, RedisService, QueryBuilderService, CountryService],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
