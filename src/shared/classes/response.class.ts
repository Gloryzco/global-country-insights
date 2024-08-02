import { ApiProperty } from '@nestjs/swagger';

export class CreatedUserResponseData {
  @ApiProperty({
    example: '8332u-dppe093I-DL099-3KDIMDIE',
    description: 'Example id',
  })
  id: string;

  @ApiProperty({
    example: 'test@test.com',
    description: 'Example email',
  })
  email: string;

  @ApiProperty({
    example: '2024-05-17 19:42:23.790482',
    description: 'Example date of creation',
  })
  createdAt: Date;
}

export class LoginUserResponseData {
  @ApiProperty({
    example: '^&vjhje8736n]c^&ve-',
    description: 'Example access token',
  })
  accessToken: string;

  @ApiProperty({
    example: '^&vjhje8736n]c^&ve-',
    description: 'Example access token',
  })
  refreshToken: string;

  @ApiProperty({
    example: '15m',
    description: 'Example token expiration',
  })
  accessTokenExpiresIn: string;

  @ApiProperty({
    example: '2d',
    description: 'Example token expiration',
  })
  refreshTokenExpiresIn: string;
}

export class refreshTokenResponseData {
  @ApiProperty({
    example: '^&vjhje8736n]c^&ve-',
    description: 'Example access token',
  })
  accessToken: string;

  @ApiProperty({
    example: '15m',
    description: 'Example token expiration',
  })
  accessTokenExpiresIn: string;
}

export class TaskResponseDto {
  @ApiProperty({ example: 'd290f1ee-6c54-4b01-90e6-d701748f0851' })
  id: string;

  @ApiProperty({ example: '8b8ed37c-cac5-441a-8841-28383535f1' })
  userId: string;

  @ApiProperty({
    example: 'Implement authentication on the Task management system',
  })
  title: string;

  @ApiProperty({ example: 'Implement JWT-based authentication' })
  description?: string;

  @ApiProperty({ example: 'new' })
  status: string;

  @ApiProperty({ example: 'Detailed description of the task content' })
  content?: string;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  createdAt: Date;
}
