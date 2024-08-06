import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/module';
import AppError from '../utils/AppError';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  constructor(
    private userService: UserService,
    private reflector: Reflector,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new AppError('0003', 'Access token is missing or invalid.');
    }
    return user;
  }
}
