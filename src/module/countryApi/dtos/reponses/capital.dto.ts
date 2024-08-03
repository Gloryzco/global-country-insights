import { IsArray } from 'class-validator';

export class CapitalInfoDto {
  @IsArray()
  latlng?: [number, number];
}
