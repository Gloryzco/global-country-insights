import { Controller, Body, Response, Post, UseGuards } from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto, RefreshTokenDto } from '../dtos';
import { AuthService } from '../services';
import {
  GetCurrentUserId,
  LoginUserResponseData,
  refreshTokenResponseData,
  ResponseFormat,
} from 'src/shared';
import { AccessTokenGuard } from 'src/shared/guards';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Authenticate to obtain a token for accessing the endpoints.' })
  @ApiOkResponse({
    description: 'User logged in',
    type: LoginUserResponseData,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Invalid username or password',
  })
  @Post('login')
  async login(@Response() res, @Body() loginDto: LoginDto) {
    const user_login = await this.authService.login(loginDto);
    ResponseFormat.successResponse(res, user_login, 'User logged in');
  }

  @ApiBearerAuth('JWT')
  @UseGuards(AccessTokenGuard)
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiOkResponse({
    description: 'Logged out successfully',
  })
  @Post('logout')
  async logout(
    @Response() res,
    @GetCurrentUserId() userId: string,
  ): Promise<any> {
    const user_logout = await this.authService.logout(userId);
    ResponseFormat.successResponse(res, user_logout, 'User logged out');
  }

  @ApiBearerAuth('JWT')
  @UseGuards(AccessTokenGuard)
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiOkResponse({
    description: 'Token refreshed successfully',
    type: refreshTokenResponseData,
  })
  @ApiNotFoundResponse({ description: 'User Rrcord not found' })
  @Post('refresh-token')
  async refreshToken(
    @Response() res,
    @Body() refreshToken: RefreshTokenDto,
  ): Promise<any> {
    const accessToken = await this.authService.refreshToken(refreshToken);
    ResponseFormat.successResponse(
      res,
      accessToken,
      'Token Refreshed Successfully',
    );
  }
}
