import { Module } from '@nestjs/common';
import { CountriesController } from './controllers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from 'src/entity';
import { CountryService } from './services';
import { QueryBuilderService } from 'src/shared';
import { RedisModule, RedisService } from '../redis';

@Module({
  imports: [
    TypeOrmModule.forFeature([Country]),
    RedisModule,
  ],
  providers: [CountryService, QueryBuilderService],
  controllers: [CountriesController],
  exports: [CountryService],
})
export class CountryApiModule {}
    