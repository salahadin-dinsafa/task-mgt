import {
    Body, Controller, Delete,
    Get, Logger, Param, ParseIntPipe, Patch, Post, Query, UseGuards
} from "@nestjs/common";

import { AuthGuard } from "@nestjs/passport";
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

import { TaskEntity } from "@app/tasks/entities/task.entity";
import { UserEntity } from "@app/auth/entities/user.entity";
import { PaginationDto } from '@app/tasks/dto/pagination.dto';
import { AddTaskDto } from '@app/tasks/dto/add-task.dto';
import { GetUser } from "@app/auth/decorator/get-user.decorator";
import { Roles } from "@app/auth/decorator/roles.decorator";
import { TasksService } from "@app/tasks/tasks.service";
import { TaskPipe } from "@app/tasks/pipe/task.pipe";
import { TaskStatus } from "@app/tasks/types/task-status.enum";
import { RolesGuard } from "@app/auth/guards/roles.guard";
import { Role } from "@app/auth/types/role.enum";
import { CoustomeExceptionDto } from "@app/common/types/http-exception-response.interface";

@ApiResponse({ status: 403, type: CoustomeExceptionDto })
@ApiBadRequestResponse({ description: 'Invalid request' })
@ApiInternalServerErrorResponse({ description: 'Internal server error occured' })
@ApiTags('Tasks')
@UseGuards(AuthGuard(), RolesGuard)
@Controller('tasks')
export class TasksController {
    private logger = new Logger('TasksController');
    constructor(
        private readonly taskService: TasksService
    ) { }


    @Roles(Role.ADMIN, Role.USER)
    @Get()
    findAllTasks(
        @Query() paginationDto: PaginationDto,
        @GetUser() user: UserEntity,
    ): Promise<TaskEntity[]> {
        this.logger.verbose(
            `User ${user.username} retriving tasks with filter: ${JSON.stringify(paginationDto)}`
        );
        return this.taskService.findAllTasks(user, paginationDto);
    }


    @ApiNotFoundResponse({ description: 'Task with #id: ${id} not found' })
    @Roles(Role.ADMIN, Role.USER)
    @Get(':id')
    findTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: UserEntity,
    ): Promise<TaskEntity> {
        this.logger.verbose(
            `User ${user.username} retriving task with id: ${id}`
        );
        return this.taskService.findTaskById(user, id)
    }

    @Roles(Role.ADMIN, Role.USER)
    @Post()
    AddTask(
        @Body() addTaskDto: AddTaskDto,
        @GetUser() user: UserEntity,
    ): Promise<TaskEntity> {
        this.logger.verbose(
            `User ${user.username} creating task with object: ${JSON.stringify(addTaskDto)}`
        );
        return this.taskService.addTask(user, addTaskDto);
    }

    @ApiNotFoundResponse({ description: 'Task with #id: ${id} not found' })
    @Roles(Role.ADMIN, Role.USER)
    @Patch(':id/status')
    updateTask(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskPipe) status: TaskStatus,
        @GetUser() user: UserEntity,
    ): Promise<TaskEntity> {
        this.logger.verbose(
            `User ${user.username} updating task with id: ${id}`
        );
        return this.taskService.updateTask(user, id, status);
    }

    @ApiNotFoundResponse({ description: 'Task with #id: ${id} not found' })
    @Roles(Role.ADMIN, Role.USER)
    @Delete(':id')
    removeTask(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: UserEntity,
    ): Promise<void> {
        this.logger.verbose(
            `User ${user.username} removing task with id: ${id}`
        );
        return this.taskService.removeTask(user, id);
    }
}