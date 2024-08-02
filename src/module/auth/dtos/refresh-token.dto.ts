import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty({ message: 'refresh token is required.' })
  @IsString()
  @ApiProperty({
    description: 'Refresh Token',
    example: 'your refresh token',
    required: true,
    type: String,
  })
  refreshToken: string;
}
