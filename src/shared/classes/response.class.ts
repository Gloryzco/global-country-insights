import { mixin } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

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

export function withPaginatedResponse<
  TBase extends new (...args: any[]) => any,
>(Base: TBase, baseTypeIsArray = true, options?: ApiPropertyOptions) {
  class ResponseDTO {
    @ApiProperty({
      example: 'OK',
    })
    status: string;

    @ApiProperty({
      example: '00',
    })
    code: string;

    @ApiProperty({
      example: 'Successful',
    })
    message: string;

    @ApiProperty({
      example: 100,
      description: 'Total number of records',
    })
    totalRecords: number;

    @ApiProperty({
      example: 3,
      description: 'Current page',
    })
    currentPage: number;
    @ApiProperty({
      example: 10,
      description: 'Total available pages',
    })
    totalPages: number;

    @ApiProperty({
      isArray: baseTypeIsArray,
      type: Base,
      ...options,
    })
    @ValidateNested({ each: true })
    @Type(() => Base)
    data: InstanceType<TBase>;

    constructor(
      data: InstanceType<TBase>,
      code: string,
      status: string,
      message: string,
    ) {
      this.data = data;
      this.status = status;
      this.code = code;
      this.message = message;
      // this.pagination = { page, limit };
    }
  }

  return mixin(ResponseDTO);
}

export function withBaseResponse<TBase extends new (...args: any[]) => any>(
  Base: TBase,
  baseTypeIsArray = true,
  options?: ApiPropertyOptions,
) {
  class ResponseDTO {
    @ApiProperty({
      example: 'OK',
    })
    status: string;

    @ApiProperty({
      example: '00',
    })
    code: string;

    @ApiProperty({
      example: 'Successful',
    })
    message: string;

    // @ApiProperty({
    //   description: 'Pagination information',
    // })
    // @ValidateNested()
    // @Type(() => Pagination)
    // pagination: Pagination;

    @ApiProperty({
      isArray: baseTypeIsArray,
      type: Base,
      ...options,
    })
    @ValidateNested({ each: true })
    @Type(() => Base)
    data: InstanceType<TBase>;

    constructor(
      data: InstanceType<TBase>,
      code: string,
      status: string,
      message: string,
    ) {
      this.data = data;
      this.status = status;
      this.code = code;
      this.message = message;
      // this.pagination = { page, limit };
    }
  }

  return mixin(ResponseDTO);
}

export class paginatedResponse<T> {
  @ApiProperty({
    example: 100,
    description: 'Total number of records',
  })
  totalRecords: number;

  @ApiProperty({
    example: 100,
    description: 'Current page',
  })
  currentPage: number;
  @ApiProperty({
    example: 100,
    description: 'Total number of pages',
  })
  totalPages: number;

  data: T;
}