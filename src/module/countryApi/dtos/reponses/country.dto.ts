import { Type } from 'class-transformer';
import { IsString, IsBoolean, IsArray, ValidateNested, IsOptional, IsObject, IsNumber } from 'class-validator';
import { NameDto } from './name.dto';
import { CurrencyDto } from './currency.dto';
import { IDDDto } from './idd.dto';
import { NativeNameDto } from './nativeName.dto';
import { MapsDto } from './maps.dto';
import { CarDto } from './car.dto';
import { FlagsDto } from './flag.dto';
import { CapitalInfoDto } from './capital.dto';


export class CountryDto {
  @ValidateNested()
  @Type(() => NameDto)
  name?: NameDto;

  @IsArray()
  @IsString({ each: true })
  tld?: string[];

  @IsString()
  cca2?: string;

  @IsString()
  ccn3?: string;

  @IsString()
  cca3?: string;

  @IsBoolean()
  independent?: boolean;

  @IsString()
  status?: string;

  @IsBoolean()
  unMember?: boolean;

  @ValidateNested()
  @Type(() => CurrencyDto)
  currencies?: Record<string, CurrencyDto>;

  @ValidateNested()
  @Type(() => IDDDto)
  idd?: IDDDto;

  @IsArray()
  @IsString({ each: true })
  capital?: string[];

  @IsArray()
  @IsString({ each: true })
  altSpellings?: string[];

  @IsString()
  region?: string;

  @ValidateNested()
  @Type(() => NativeNameDto)
  languages?: Record<string, string>;

  @ValidateNested()
  @Type(() => NativeNameDto)
  translations?: Record<string, NativeNameDto>;

  @IsArray()
  @IsNumber({}, { each: true })
  latlng?: [number, number];

  @IsBoolean()
  landlocked?: boolean;

  @IsNumber()
  area?: number;

  @ValidateNested()
  @Type(() => NativeNameDto)
  demonyms?: Record<string, NativeNameDto>;

  @IsString()
  flag?: string;

  @ValidateNested()
  @Type(() => MapsDto)
  maps?: MapsDto;

  @IsNumber()
  population?: number;

  @ValidateNested()
  @Type(() => CarDto)
  car?: CarDto;

  @IsArray()
  @IsString({ each: true })
  timezones?: string[];

  @IsArray()
  @IsString({ each: true })
  continents?: string[];

  @ValidateNested()
  @Type(() => FlagsDto)
  flags?: FlagsDto;

  @IsOptional()
  @IsObject()
  coatOfArms?: Record<string, any>;

  @IsString()
  startOfWeek?: string;

  @ValidateNested()
  @Type(() => CapitalInfoDto)
  capitalInfo?: CapitalInfoDto;
}
