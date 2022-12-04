import { Module } from '@nestjs/common';

import { TasksController } from '@app/tasks/tasks.controller';
import { TasksService } from '@app/tasks/tasks.service';

@Module({
    controllers: [TasksController],
    providers: [TasksService]
})
export class TasksModule { }