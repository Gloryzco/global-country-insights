import { ApiProperty } from '@nestjs/swagger';

export class StatisticsDto {
  @ApiProperty({
    description: 'Total number of countries',
    example: 195,
  })
  totalCountries: number;

  @ApiProperty({
    description: 'Largest country by area',
    example: {
      name: 'Russia',
      area: 17098242,
    },
  })
  largestCountryByArea: { name: string; area: number };

  @ApiProperty({
    description: 'Smallest country by population',
    example: {
      name: 'Vatican City',
      population: 800,
    },
  })
  smallestCountryByPopulation: { name: string; population: number };

  @ApiProperty({
    description: 'Most widely spoken language',
    example: {
      language: 'English',
      numberOfSpeakers: 1500000000,
    },
  })
  mostWidelySpokenLanguage: { language: string; numberOfSpeakers: number };
}
