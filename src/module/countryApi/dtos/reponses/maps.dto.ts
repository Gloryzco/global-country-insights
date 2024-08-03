import { IsString } from 'class-validator';

export class MapsDto {
  @IsString()
  googleMaps?: string;

  @IsString()
  openStreetMaps?: string;
}
