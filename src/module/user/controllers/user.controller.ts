import { Controller, Body, Response, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from '../dtos';
import { UserService } from '../services';
import { CreatedUserResponseData, ResponseFormat } from 'src/shared';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiCreatedResponse({
    description: 'User registered succesfully',
    type: CreatedUserResponseData,
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  @ApiBody({ type: CreateUserDto })
  async create(
    @Response() res,
    @Body() createUserDto: CreateUserDto,
  ): Promise<any> {
    const new_user = await this.userService.create(createUserDto);
    ResponseFormat.successResponse(
      res,
      new_user,
      'User created successfully',
      201,
    );
  }
}
