import { config } from 'dotenv';
config();

if (!process.env.IS_TS_NODE) {
  require('module-alias/register');
}
import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';

import * as morgan from 'morgan';

import { AppModule } from '@app/app.module';
import { AllExceptionsFilter } from '@app/common/fillter/all-exception.filter';

const logStream = fs.createWriteStream('api.log', { flags: 'a' })

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(morgan('combined', { stream: logStream }));
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(3000);
}
bootstrap();
