import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { ConfigService } from '@nestjs/config';

import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Primary
  app.use(helmet());
  app.use((req, _res, next) => {
    req.setTimeout(10000); // Set timeout to 10 seconds
    next();
  });

  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ limit: '20mb', extended: true }));
  app.enableCors({ origin: '*' });

  // Secondary
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api');

  // Setup Swagger in case of non production env.
  const configService = app.get(ConfigService);
  if (configService.getOrThrow('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Partnership API Documentation')
      .setDescription(
        'This documentation provides a comprehensive set of endpoints for managing Partnership apis. It allows you to list key functionalities of Partnership Apis.',
      )
      .setVersion('V1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(configService.getOrThrow<number>('PORT'));
  console.log(`Application is running on: ${await app.getUrl()}/docs`);
}
bootstrap();
