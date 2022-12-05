import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { TasksController } from '@app/tasks/tasks.controller';
import { TasksService } from '@app/tasks/tasks.service';
import { TaskEntity } from '@app/tasks/entities/task.entity';
import { AuthModule } from '@app/auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([TaskEntity]),
        AuthModule
    ],
    controllers: [TasksController],
    providers: [TasksService]
})
export class TasksModule { }