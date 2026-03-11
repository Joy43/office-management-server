import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import 'reflect-metadata';
import { AppModule } from './app.module';
import { ENVEnum } from './common/enum/env.enum';
import { AllExceptionsFilter } from './core/filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });
  const configService = app.get(ConfigService);

  // * ------------ Serve static files from uploads directory ------------
  app.useStaticAssets(path.join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  // * enable cors
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:5173',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // * add global pipes
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // * add global filters
  app.useGlobalFilters(new AllExceptionsFilter());

  // * Swagger config with Bearer Auth
  const config = new DocumentBuilder()
    .setTitle('DABUEK_GYEDU example')
    .setDescription('The DABUEK_GYEDU API description')
    .setVersion('3.0')
    .addTag('DABUEK_GYEDU')
    .addBearerAuth()
    .build();

  // ------------- ``Swagger setup
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'DABUEK_GYEDU API Docs',
  });

  // * ------------- add body parser -------------
  app.use('/stripe-webhook', bodyParser.raw({ type: 'application/json' }));

  // * -------------- set port --------------
  const port = parseInt(configService.get<string>(ENVEnum.PORT) ?? '5000', 10);
  await app.listen(port);
  console.log(`╔════════════════════════════════════════════╗`);
  console.log(`║  Server running on http://localhost:${port}      ║`);
  console.log(`║  Swagger →     http://localhost:${port}/api/docs    ║`);
  console.log(`╚════════════════════════════════════════════╝`);
}
bootstrap();
