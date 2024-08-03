import { Module } from '@nestjs/common';
import { CountriesController } from './controllers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country, Language, Region, Statistics } from 'src/entity';

@Module({
  imports: [TypeOrmModule.forFeature([Country, Language, Statistics, Region])],
  // providers: [CountryApiService],
  controllers: [CountriesController],
  // exports: [CountryApiService],
})
export class CountryApiModule {}
