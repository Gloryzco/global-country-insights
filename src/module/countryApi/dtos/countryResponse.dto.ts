import { ApiProperty } from '@nestjs/swagger';

export class CountryResponseDto {
  @ApiProperty({ description: 'Common name of the country', example: 'Norway' })
  commonName: string;

  @ApiProperty({ description: 'Official name of the country', example: 'Kingdom of Norway' })
  officialName: string;

  @ApiProperty({
    description: 'Native names of the country in different languages',
    example: {
      nno: { official: 'Kongeriket Noreg', common: 'Noreg' },
      nob: { official: 'Kongeriket Norge', common: 'Norge' },
      smi: { official: 'Norgga gonagasriika', common: 'Norgga' },
    },
  })
  nativeName: {
    [key: string]: {
      official: string;
      common: string;
    };
  };

  @ApiProperty({ description: 'Two-letter country code', example: 'NO' })
  cca2: string;

  @ApiProperty({ description: 'Three-letter country code', example: 'NOR' })
  cca3: string;

  @ApiProperty({ description: 'Region of the country', example: 'Europe' })
  region: string;

  @ApiProperty({ description: 'Subregion of the country', example: 'Northern Europe' })
  subregion: string;

  @ApiProperty({
    description: 'Languages spoken in the country',
    example: {
      nno: 'Norwegian Nynorsk',
      nob: 'Norwegian Bokmål',
      smi: 'Sami',
    },
  })
  languages: {
    [key: string]: string;
  };

  @ApiProperty({
    description: 'Currency information',
    example: { name: 'Norwegian krone', symbol: 'kr' },
  })
  currencies: {
    name: string;
    symbol: string;
  };

  @ApiProperty({ description: 'Capital city', example: ['Oslo'] })
  capital: string[];

  @ApiProperty({ description: 'Geographic coordinates', example: [62, 10] })
  latlng: number[];

  @ApiProperty({ description: 'Whether the country is landlocked', example: false })
  landlocked: boolean;

  @ApiProperty({
    description: 'Bordering countries',
    example: ['FIN', 'SWE', 'RUS'],
  })
  borderingCountries: string[];

  @ApiProperty({ description: 'Area of the country', example: 323802 })
  area: number;

  @ApiProperty({
    description: 'Flag image URLs in PNG and SVG formats',
    example: {
      png: '(link unavailable)',
      svg: '(link unavailable)',
      alt: 'The flag of Norway has a red field with a large white-edged navy blue cross that extends to the edges of the field. The vertical part of this cross is offset towards the hoist side.',
    },
  })
  flags: {
    png: string;
    svg: string;
    alt: string;
  };

  @ApiProperty({
    description: 'Coat of arms image URLs in PNG and SVG formats',
    example: {
      png: '(link unavailable)',
      svg: '(link unavailable)',
    },
  })
  coatOfArms: {
    png: string;
    svg: string;
  };
}