import { config } from 'dotenv';
config();

import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import * as fs from 'fs';

import * as morgan from 'morgan';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/fillter/all-exception.filter';

const logStream = fs.createWriteStream('api.log', { flags: 'a' })

async function bootstrap() {
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(AppModule, {cors: true});
  app.setGlobalPrefix('api');
  app.use(morgan('common', { stream: logStream }));
  app.useGlobalFilters(new AllExceptionsFilter());

  const options = new DocumentBuilder()
    .setTitle('Task Management Application')
    .setDescription('Task Management Application is based on role of user. A user can create, update, remove, get his own tasks')
    .setVersion('1.0.0')
    .setContact('Salahadin Dinsafa', '', 'salahadindinsafa@gmail.com')
    .setLicense('MIT', 'https://openapi.api/license/MIT')
    .build();
  const document = SwaggerModule.createDocument(app, options, { ignoreGlobalPrefix: true });
  SwaggerModule.setup('api', app, document);

  const port: number = +process.env.PORT || 3001;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
