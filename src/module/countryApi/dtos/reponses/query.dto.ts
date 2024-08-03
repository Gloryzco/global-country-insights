import { ApiPropertyOptional, ApiQuery } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';

export class QueryDTO {
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

  @ApiPropertyOptional({
    description: 'Page number for pagination. The default value is 1.',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  page?: number = 1; // Default to page 1

  @ApiPropertyOptional({
    description: 'Number of items per page for pagination. The default value is 10.',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10; // Default to 10 items per page
}
