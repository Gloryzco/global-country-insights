import { IsString } from 'class-validator';

export class FlagsDto {
  @IsString()
  png?: string;

  @IsString()
  svg?: string;
}
