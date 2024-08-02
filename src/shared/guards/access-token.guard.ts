import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import AppError from '../utils/app-error.utils';
import { UserService } from 'src/module';

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
      throw new AppError('0005', 'Access token is missing or invalid.');
    }
    return user;
  }
}
