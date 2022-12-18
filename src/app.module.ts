import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';

import { TasksModule } from './tasks/tasks.module';
import { ormConfig } from './common/db/ormconfig.db';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';


@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DB_HOST: Joi.required(),
        DB_PORT: Joi.required().default(5432),
        DB_NAME: Joi.required(),
        DB_USER: Joi.required(),
        DB_PASSWORD: Joi.required(),
        JWT_SECRET: Joi.required(),
        ROLES_KEY: Joi.required()
      })
    }),
    TasksModule,
    TypeOrmModule.forRootAsync({
      useFactory: ormConfig
    }),
    AuthModule
  ],
  controllers: [AppController],
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
