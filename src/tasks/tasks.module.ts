import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { TasksController } from '@app/tasks/tasks.controller';
import { TasksService } from '@app/tasks/tasks.service';
import { TaskEntity } from '@app/tasks/entities/task.entity';

@Module({
    imports: [TypeOrmModule.forFeature([TaskEntity])],
    controllers: [TasksController],
    providers: [TasksService]
})
export class TasksModule { }