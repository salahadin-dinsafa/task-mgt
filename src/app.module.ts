import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { TasksModule } from '@app/tasks/tasks.module';
import { ormConfig } from '@app/common/db/ormconfig.db';
import { AuthModule } from './auth/auth.module';
import * as Joi from '@hapi/joi';


@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DB_HOST: Joi.required(),
        DB_PORT: Joi.required().default(5432),
        DB_NAME: Joi.required(),
        DB_USER: Joi.required(),
        DB_PASSWORD: Joi.required()
      })
    }),
    TasksModule,
    TypeOrmModule.forRootAsync({
      useFactory: ormConfig
    }),
    AuthModule
  ],
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () => new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true }
      })
    }
  ]
})
export class AppModule { }
