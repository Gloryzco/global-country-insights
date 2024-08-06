import { IsString, IsBoolean, IsNumber, IsArray, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class NativeNameDto {
  @IsString()
  official: string;

  @IsString()
  common: string;
}

class CurrenciesDto {
  @IsString()
  name: string;

  @IsString()
  symbol: string;
}

class FlagsDto {
  @IsString()
  png: string;

  @IsString()
  svg: string;

  @IsString()
  alt: string;
}

class CoatOfArmsDto {
  @IsString()
  png: string;

  @IsString()
  svg: string;
}

export class CountryDto {
  @IsString()
  commonName: string;

  @IsString()
  officialName: string;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => NativeNameDto)
  nativeName: Record<string, NativeNameDto>;

  @IsString()
  cca2: string;

  @IsString()
  cca3: string;

  @IsString()
  region: string;

  @IsNumber()
  population: number;

  @IsString()
  subregion: string;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => String)
  languages: Record<string, string>;

  @IsObject()
  @ValidateNested()
  @Type(() => CurrenciesDto)
  currencies: CurrenciesDto;

  @IsArray()
  @IsString({ each: true })
  capital: string[];

  @IsArray()
  @IsNumber({}, { each: true })
  latlng: [number, number];

  @IsBoolean()
  landlocked: boolean;

  @IsArray()
  @IsString({ each: true })
  borderingCountries: string[];

  @IsNumber()
  area: number;

  @IsObject()
  @ValidateNested()
  @Type(() => FlagsDto)
  flags: FlagsDto;

  @IsObject()
  @ValidateNested()
  @Type(() => CoatOfArmsDto)
  coatOfArms: CoatOfArmsDto;
}
