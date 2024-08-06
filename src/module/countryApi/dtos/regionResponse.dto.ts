import { CountryDto } from "./country.dto";
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { CountryResponseDto } from "./countryResponse.dto";

export class RegionResponseDto {
    @ApiProperty({
      description: 'The name of the region',
      example: 'Europe',
    })
    @IsString()
    readonly name: string;
  
    @ApiProperty({
      description: 'List of countries in the region',
      type: [CountryResponseDto],
    })
    @IsArray()
    @Type(() => CountryDto)
    readonly countries: CountryDto[];
  
    @ApiProperty({
      description: 'Total population of the region',
      example: 741400000,
    })
    @IsNumber()
    readonly totalPopulation: number;
  }
