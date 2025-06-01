import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import compression from 'compression';
import { join } from 'path';
import { HttpExceptionFilter, UnknownExceptionFilter } from './filters';
import { ApiTransformInterceptor } from './interceptors';
import { setupSwagger } from './setup-swagger';
import {
  HttpStatus,
  Logger,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import morgan from 'morgan';
import { appConfig, kafkaConfig } from './config';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import expressBasicAuth from 'express-basic-auth';

function basicAuth() {
  return expressBasicAuth({
    challenge: true,
    users: {
      [appConfig.basicAuth.user]: appConfig.basicAuth.password,
    },
  });
}

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });
  app.enableCors();
  app.use(compression());
  app.enableVersioning();
  // app.use(json({ limit: '10mb' }));
  // app.use(urlencoded({ extended: true, limit: '10mb' }));

  if (appConfig.basicAuth.enabled) {
    app.use(
      [
        appConfig.documentationPath,
        `${appConfig.prefixPath}/docs`,
        `${appConfig.prefixPath}/docs-json`,
        `${appConfig.prefixPath}/docs-yaml`,
      ],
      basicAuth(),
    );
  }

  app.useStaticAssets(join(__dirname, '..', 'documentation'), {
    prefix: appConfig.documentationPath,
  });
  app.useStaticAssets(join(__dirname, '..', 'public/.well-known'), {
    prefix: '/.well-known',
    setHeaders: (res, path, stat) => {
      res.setHeader('Content-Type', 'application/json');
    },
  });
  app.setBaseViewsDir(join(__dirname, 'views'));
  app.setViewEngine('hbs');

  app.setGlobalPrefix(appConfig.prefixPath, {
    exclude: ['share/(.*)', 'redirect/(.*)', 'rank/(.*)','render/(.*)'],
  });
  if (appConfig.swaggerEnabled) {
    setupSwagger(app, `${appConfig.prefixPath}/docs`);
  }

  // const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ApiTransformInterceptor());
  app.useGlobalFilters(new UnknownExceptionFilter(), new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      skipUndefinedProperties: false,
      skipMissingProperties: false,
      whitelist: false,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      dismissDefaultMessages: false,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new UnprocessableEntityException(
          validationErrors.map((error) => ({
            field: error.property,
            error: Object.values(error.constraints).join(', '),
          })),
        );
      },
    }),
  );

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: kafkaConfig.brokers,
        clientId: kafkaConfig.clientId,
        sasl: kafkaConfig.kafkaSaslEnabled
          ? ({
              mechanism: kafkaConfig.sasl.mechanism,
              username: kafkaConfig.sasl.username,
              password: kafkaConfig.sasl.password,
            } as any)
          : undefined,
      },
      consumer: {
        groupId: kafkaConfig.groupId,
        allowAutoTopicCreation: true,
      },
    },
  });
  app
    .startAllMicroservices()
    .catch((err) =>
      Logger.warn('app.startAllMicroservices err: ' + err.message, 'bootstrap'),
    );

  app.use(morgan('combined'));
  await app.listen(appConfig.port, appConfig.host);
  Logger.log(
    `Application listening on port ${appConfig.host}:${appConfig.port}`,
    'bootstrap',
  );
}

bootstrap();
