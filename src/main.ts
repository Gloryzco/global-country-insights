import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import configuration from './config/configuration';
import { CountryService } from './module';
import AppValidationError from './shared/utils/AppValidationError';

const config = configuration();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const countryService = app.get(CountryService);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const constraints = validationErrors[0]?.constraints || null;
        let message = null;
        if (typeof constraints == 'object') {
          const message_key = Object.keys(validationErrors[0].constraints)[0];
          message = validationErrors[0].constraints[message_key];
        }
        return new AppValidationError(message || 'Validation Error Occured');
      },
    }),
  );

  app.enableCors({
    origin: '*',
    methods: 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization, X-Requested-With, token',
  });

  const configuration = new DocumentBuilder()
    .setTitle('Country API')
    .setDescription('COUNTRY API')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .setExternalDoc('Postman Collection', '/api-json')
    .build();

  const document = SwaggerModule.createDocument(app, configuration);
  SwaggerModule.setup('/documentation', app, document);
  const limiter = rateLimit({
    windowMs: 1000,
    max: 6000,
  });

  app.use(compression());
  app.use(helmet());
  app.use(limiter);

  await app.listen(config.app.port, () => {
    console.warn(`server listening on port ${config.app.port}`);
  });
}
bootstrap();
