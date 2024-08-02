import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Emiil is required.' })
  @IsString()
  @IsEmail()
  @ApiProperty({
    description: `User's email address`,
    example: 'test@sample.com',
    required: true,
    title: 'Email',
  })
  readonly email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @ApiProperty({
    description: 'Password',
    example: 'password',
    required: true,
    title: 'Password',
  })
  readonly password: string;
}
