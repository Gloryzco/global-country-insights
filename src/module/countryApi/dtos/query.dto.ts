import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';

export class QueryDTO {
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @ApiProperty({
    description: 'Number of pages to display',
    example: 1,
    required: false,
    title: 'page',
    default: 1,
  })
  readonly page?: number;

  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  @ApiProperty({
    description: 'Size of data per page',
    example: 10,
    required: false,
    title: 'limit',
    default: 10,
  })
  readonly limit?: number;

  @ApiPropertyOptional({
    description: 'Filter countries by region. e.g., "Europe", "Asia".',
    example: 'Europe',
  })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiPropertyOptional({
    description: 'Filter countries by minimum population size.',
    example: 100000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPopulation?: number;

  @ApiPropertyOptional({
    description: 'Filter countries by maximum population size.',
    example: 5000000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPopulation?: number;

  // @ApiPropertyOptional({
  //   description:
  //     'Comma-separated list of fields to include in the API response.',
  //   example: 'commonName,capital,population',
  // })
  // @IsOptional()
  // @IsString()
  // fields?: string; 
}
