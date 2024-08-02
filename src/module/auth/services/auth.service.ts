import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RefreshTokenDto } from '../dtos';
import * as argon from 'argon2';
import { AccessToken, JwtPayload, RefreshToken } from 'src/shared';
import { UserService } from 'src/module/user';
import configuration from 'src/config/configuration';
import AppError from 'src/shared/utils/app-error.utils';

const config = configuration();

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async generateAccessToken(
    userId: string,
    email: string,
  ): Promise<AccessToken> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };

    const accessToken = await this.jwtService.signAsync(jwtPayload, {
      secret: config.jwt.accessTokenSecret,
      expiresIn: config.jwt.accessTokenExpiration,
    });

    return {
      accessToken: accessToken,
      accessTokenExpiresIn: config.jwt.accessTokenExpiration,
    };
  }

  async generateRefreshTokens(
    userId: string,
    email: string,
  ): Promise<RefreshToken> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };

    const refreshToken = await this.jwtService.signAsync(jwtPayload, {
      secret: config.jwt.refreshTokenSecret,
      expiresIn: config.jwt.refreshTokenExpiration,
    });

    return {
      refreshToken: refreshToken,
      refreshTokenExpiresIn: config.jwt.refreshTokenExpiration,
    };
  }

  async refreshToken(payload: RefreshTokenDto) {
    const { sub, email } = await this.jwtService.verifyAsync<JwtPayload>(
      payload.refreshToken,
      { secret: config.jwt.refreshTokenSecret },
    );

    const user = await this.userService.findById(sub);

    if (!user) {
      throw new AppError('0002', 'Invalid refresh token');
    }
    const accessToken = await this.generateAccessToken(sub, email);
    return accessToken;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await argon.hash(refreshToken);
    await this.userService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async login(loginDto: LoginDto): Promise<AccessToken | RefreshToken> {
    const { email, password } = loginDto;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new AppError('0002', 'User not found');
    }
    const isValidPassword = await user.verifyPassword(password, user.password);

    if (!isValidPassword) {
      throw new AppError('0002', 'invalid credentials');
    }

    const accessTokenDetails = await this.generateAccessToken(
      user.id,
      user.email,
    );
    const refreshTokenDetails = await this.generateRefreshTokens(
      user.id,
      user.email,
    );

    const tokens: AccessToken | RefreshToken = {
      ...accessTokenDetails,
      ...refreshTokenDetails,
    };
    await this.updateRefreshToken(user.id, refreshTokenDetails.refreshToken);
    return tokens;
  }

  async logout(userId: string): Promise<boolean> {
    const user = await this.userService.findById(userId);
    if (!user || !user.refreshToken) {
      throw new AppError('0005', 'Access denied. Login required');
    }

    await this.userService.update(userId, { refreshToken: null });

    return true;
  }
}
