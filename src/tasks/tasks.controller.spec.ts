import { AuthGuard, PassportModule } from "@nestjs/passport"
import { Test, TestingModule } from "@nestjs/testing"

import { UserEntity } from "../auth/entities/user.entity"
import { PaginationDto } from "./dto/pagination.dto"
import { TasksController } from "./tasks.controller"
import { TasksService } from "./tasks.service"
import { AddTaskType } from "./types/add-task.type"
import { PaginationType } from "./types/pagination.type"
import { TaskStatus } from "./types/task-status.enum"

const mockTasksService = {
    findAllTasks: jest.fn().mockImplementation((_pagination: PaginationType, _user: UserEntity) => {
        return {
            tasks: 'All Tasks'
        }
    }),
    findTaskById: jest.fn().mockImplementation((_id: number, _user: UserEntity) => {
        return {
            ...mockTask
        }
    }),
    addTask: jest.fn().mockImplementation((addTask: AddTaskType, user: UserEntity) => {
        return {
            ...mockTask
        }
    }),
    updateTask: jest.fn().mockImplementation((_id: number, _status: TaskStatus, _user: UserEntity) => {
        return {
            ...mockTask,
            status: TaskStatus.IN_PROGRESS
        }
    }),
    removeTask: jest.fn().mockImplementation((_id: number, _user: UserEntity) => {
        return null;
    })
}
const mockPagination: PaginationDto = { limit: 2, offset: 0, search: 'a', status: TaskStatus.OPEN }
const mockUser: UserEntity = new UserEntity();
const mockTask = { id: 1, title: 'foo', description: 'foo', status: TaskStatus.DONE };

describe('TasksController', () => {
    let tasksController: TasksController;
    let tasksService: TasksService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                PassportModule.register({ defaultStrategy: 'jwt' })

            ],
            controllers: [TasksController],
            providers: [
                TasksService,
                { provide: AuthGuard, useValue: jest.fn().mockImplementation(() => true) }

            ]
        })
            .overrideProvider(TasksService).useValue(mockTasksService)
            .compile();

        tasksController = module.get<TasksController>(TasksController);
        tasksService = module.get<TasksService>(TasksService);
    })

    it('should be defined', () => {
        expect(tasksController).toBeDefined();
    })
    describe('findAllTasks', () => {
        it('should retrive all tasks', async () => {
            const tasks = await tasksController.findAllTasks(mockPagination, mockUser);
            expect(tasks).toBeDefined();
            expect(tasks).toEqual({ tasks: 'All Tasks' });
        })
    })
    describe('findTaskById', () => {
        it('should return a task', async () => {
            const task = await tasksController.findTaskById(1, mockUser);
            expect(task).toBeDefined();
            expect(task).toEqual(mockTask);
        })
    })
    describe('addTask', () => {
        it('should add a task', async () => {
            const task = await tasksController.addTask(mockTask, mockUser);
            expect(task).toBeDefined();
            expect(task).toEqual(mockTask);
        })
    })
    describe('updateTask', () => {
        it('should update a task', async () => {
            const task = await tasksController.updateTask(1, TaskStatus.IN_PROGRESS, mockUser);
            expect(task).toBeDefined();
            expect(task).toEqual({ ...mockTask, status: TaskStatus.IN_PROGRESS });
        })
    })
    describe('removeTask', () => {
        it('should remove a task', async () => {
            const task = await tasksController.removeTask(1, mockUser);
            expect(task).toBeDefined();
            expect(task).toEqual(null);
        })
    })
})