import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, Min, Max, min, Length } from 'class-validator';

export class CodeDTO {
  @Length(3, 3, {message: 'Code must be 3 characters long'})
  @IsString()
  @Type(() => String)
  @ApiProperty({
    description:
      'Country code usually 3 letters. e.g. NGR for Nigeria, USA for the United States of America',
    example: 'NGR',
    required: true,
    title: 'cca3',
  })
  readonly code: string;
}
