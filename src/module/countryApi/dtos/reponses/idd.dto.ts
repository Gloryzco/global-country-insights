import { IsString, IsArray } from 'class-validator';

export class IDDDto {
  @IsString()
  root?: string;

  @IsArray()
  @IsString({ each: true })
  suffixes?: string[];
}
