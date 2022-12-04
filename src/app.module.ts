import { Module, ValidationPipe } from '@nestjs/common';

import { TasksModule } from '@app/tasks/tasks.module';
import { APP_PIPE } from '@nestjs/core';


@Module({
  imports: [TasksModule],
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
