import {
    Body, Controller, Delete,
    Get, Logger, Param, ParseIntPipe,
    Patch, Post, Query, UseGuards
} from "@nestjs/common";

import { AuthGuard } from "@nestjs/passport";
import {
    ApiBadRequestResponse, ApiCreatedResponse, ApiInternalServerErrorResponse,
    ApiNotFoundResponse, ApiOkResponse, ApiOperation,
    ApiTags, ApiUnauthorizedResponse
} from "@nestjs/swagger";

import { TaskEntity } from "./entities/task.entity";
import { UserEntity } from "../auth/entities/user.entity";
import { PaginationDto } from './dto/pagination.dto';
import { AddTaskDto } from './dto/add-task.dto';
import { GetUser } from "../auth/decorator/get-user.decorator";
import { Roles } from "../auth/decorator/roles.decorator";
import { TasksService } from "./tasks.service";
import { TaskPipe } from "./pipe/task.pipe";
import { TaskStatus } from "./types/task-status.enum";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Role } from "../auth/types/role.enum";
import { CoustomeHttpException } from "../common/types/http-exception-response.interface";
import { TaskResponse, TaskResponseType } from "./types/task-response.type";

@ApiBadRequestResponse({ type: CoustomeHttpException, description: 'Bad request' })
@ApiUnauthorizedResponse({ type: CoustomeHttpException, description: 'Unauthorized' })
@ApiBadRequestResponse({ type: CoustomeHttpException, description: 'Invalid request' })
@ApiInternalServerErrorResponse({ type: CoustomeHttpException, description: 'Internal server error occured' })
@ApiTags('Tasks')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('tasks')
export class TasksController {
    private logger = new Logger('TasksController');
    constructor(
        private readonly taskService: TasksService
    ) { }

    @ApiOperation({ description: 'Get all tasks create by user: Auth required', summary: 'Get letest articles' })
    @ApiOkResponse({ type: TaskResponse, isArray: true })
    @Roles(Role.ADMIN, Role.USER)
    @Get()
    findAllTasks(
        @Query() paginationDto: PaginationDto,
        @GetUser() user: UserEntity,
    ): Promise<TaskResponseType[]> {
        this.logger.verbose(
            `User ${user.username} retriving tasks with filter: ${JSON.stringify(paginationDto)}`
        );
        return this.taskService.findAllTasks(user, paginationDto);
    }


    @ApiOperation({ description: 'Get a task create by user: Auth required', summary: 'Get a single task' })
    @ApiNotFoundResponse({ type: CoustomeHttpException, description: 'Task with not found' })
    @ApiOkResponse({ type: TaskResponse, description: 'Task found' })
    @Roles(Role.ADMIN, Role.USER)
    @Get(':id')
    findTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: UserEntity,
    ): Promise<TaskResponse> {
        this.logger.verbose(
            `User ${user.username} retriving task with id: ${id}`
        );
        return this.taskService.findTask(user, id)
    }

    @ApiCreatedResponse({ type: TaskResponse, description: 'Task is created' })
    @ApiOperation({ description: 'Create task: Auth required', summary: 'Create task' })
    @Roles(Role.ADMIN, Role.USER)
    @Post()
    addTask(
        @Body() addTaskDto: AddTaskDto,
        @GetUser() user: UserEntity,
    ): Promise<TaskResponseType> {
        this.logger.verbose(
            `User ${user.username} creating task with object: ${JSON.stringify(addTaskDto)}`
        );
        return this.taskService.addTask(user, addTaskDto);
    }

    @ApiOkResponse({ type: TaskResponse, description: 'Updated' })
    @ApiOperation({ description: 'Update task created by user: Auth required', summary: 'Update task' })
    @ApiNotFoundResponse({ type: CoustomeHttpException, description: 'Task with #id: not found' })
    @Roles(Role.ADMIN, Role.USER)
    @Patch(':id/status')
    updateTask(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskPipe) status: TaskStatus,
        @GetUser() user: UserEntity,
    ): Promise<TaskResponseType> {
        this.logger.verbose(
            `User ${user.username} updating task with id: ${id}`
        );
        return this.taskService.updateTask(user, id, status);
    }

    @ApiOperation({ description: 'Delete task created by user: Auth required', summary: 'Delete task' })
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