import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

export class RegionDTO {
  @ApiPropertyOptional({
    description: 'Comma-separated list of region names. e.g. "Asia,Europe"',
    example: 'Asia,Europe',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  @Matches(/^([a-zA-Z\s]+)(,[a-zA-Z\s]+)*$/, {
    message: 'Regions must be a comma-separated list of valid region names',
  })
  readonly regions: string;
}
