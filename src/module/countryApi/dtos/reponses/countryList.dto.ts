import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested, IsNumber } from 'class-validator';
import { CountryDto } from './country.dto';

export class CountryListResponseDto {
  @ApiProperty({
    description: 'Total number of countries that match the query criteria.',
    example: 195,
  })
  @IsNumber()
  totalCount: number;

  @ApiProperty({
    description: 'Total number of pages available based on pagination.',
    example: 20,
  })
  @IsNumber()
  totalPages: number;

  @ApiProperty({
    description: 'Current page number in the paginated result.',
    example: 1,
  })
  @IsNumber()
  currentPage: number;

  @ApiProperty({
    description: 'Number of items per page.',
    example: 10,
  })
  @IsNumber()
  pageSize: number;

  @ApiProperty({
    description: 'List of countries for the current page.',
    type: [CountryDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CountryDto)
  data: CountryDto[];
}
