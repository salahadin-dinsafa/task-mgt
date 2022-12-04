import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";

import { TasksService } from "@app/tasks/tasks.service";
import { TaskEntity } from "@app/tasks/entities/task.entity";
import { AddTaskDto } from '@app/tasks/dto/add-task.dto';
import { PaginationDto } from '@app/tasks/dto/pagination.dto';
import { TaskPipe } from "@app/tasks/pipe/task.pipe";
import { TaskStatus } from "./types/task-status.enum";

@Controller('tasks')
export class TasksController {
    constructor(
        private readonly taskService: TasksService
    ) { }

    @Get()
    findAllTasks(@Query() paginationDto: PaginationDto): TaskEntity[] {
        return this.taskService.findAllTasks(paginationDto);
    }

    @Get(':id')
    findTaskById(@Param('id', ParseIntPipe) id: number): TaskEntity {
        return this.taskService.findTaskById(id)
    }

    @Post()
    AddTask(@Body() addTaskDto: AddTaskDto): TaskEntity {
        return this.taskService.addTask(addTaskDto);
    }

    @Patch(':id/status')
    updateTask(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskPipe) status: TaskStatus,
    ): TaskEntity {
        return this.taskService.updateTask(id, status);
    }

    @Delete(':id')
    removeTask(@Param('id', ParseIntPipe) id: number): void {
        return this.taskService.removeTask(id);
    }
}