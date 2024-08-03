import { IsOptional, IsString } from 'class-validator';

export class NativeNameDto {
  @IsOptional()
  @IsString()
  official?: string;

  @IsOptional()
  @IsString()
  common?: string;
}
