import { IsString, IsArray } from 'class-validator';

export class CarDto {
  @IsArray()
  @IsString({ each: true })
  signs?: string[];

  @IsString()
  side?: string;
}
