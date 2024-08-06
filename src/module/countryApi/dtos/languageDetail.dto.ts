import { ApiProperty } from '@nestjs/swagger';

export class LanguageDetail {
  @ApiProperty({
    description: 'Name of the language',
    example: 'English',
  })
  language: string;

  @ApiProperty({
    description: 'List of countries where the language is spoken',
    example: ['United States', 'United Kingdom', 'Australia'],
  })
  countries: string[];

  @ApiProperty({
    description: 'Total number of speakers globally',
    example: 1500000000,
  })
  totalSpeakers: number;
}
