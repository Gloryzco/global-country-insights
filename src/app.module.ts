import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule, RedisModule, UserModule } from './module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/datasource';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalExceptionFilter, TimeoutInterceptor } from './shared';
import configuration from './config/configuration';

const config = configuration();
@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    UserModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    {
      provide: APP_INTERCEPTOR,
      useFactory: () => {
        const timeoutInMilliseconds: number = +config.app.timeout;
        return new TimeoutInterceptor(timeoutInMilliseconds);
      },
      inject: [],
    },
  ],
})
export class AppModule {}
