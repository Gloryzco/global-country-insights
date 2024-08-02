import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy, RefreshTokenStrategy } from 'src/shared';
import { AuthController } from './controllers';
import { AuthService } from './services';
import { UserModule } from '../user';

@Module({
  imports: [JwtModule.register({}), UserModule],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
