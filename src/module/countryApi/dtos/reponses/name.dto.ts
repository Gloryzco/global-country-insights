import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { NativeNameDto } from './nativeName.dto';

export class NameDto {
  @IsString()
  common?: string;

  @IsString()
  official?: string;

  @ValidateNested({ each: true })
  @Type(() => NativeNameDto)
  nativeName?: Record<string, NativeNameDto>;
}
