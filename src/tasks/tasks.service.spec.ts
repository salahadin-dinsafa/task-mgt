import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { getRepositoryToken } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";

import { UserEntity } from "../auth/entities/user.entity";
import { Role } from "../auth/types/role.enum";
import { TaskEntity } from "./entities/task.entity";
import { TasksService } from "./tasks.service"
import { AddTaskType } from "./types/add-task.type";
import { PaginationType } from "./types/pagination.type";
import { TaskStatus } from "./types/task-status.enum";

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn()
});

describe('TasksService', () => {
    let taskService: TasksService;
    let taskRespository: MockRepository;

    const mockUser: UserEntity = new UserEntity();
    mockUser.id = 1;
    mockUser.username = 'admin';
    mockUser.password = 'A/ur14648/10';
    mockUser.role = Role.ADMIN;

    const mockTask: TaskEntity = new TaskEntity();
    mockTask.id = 1;
    mockTask.author = mockUser;
    mockTask.title = 'Task foo';
    mockTask.description = 'Task foo Description';

    const mockTaskType: AddTaskType = {
        title: 'foo',
        description: 'foo',
        status: TaskStatus.OPEN
    }

    const mockPagination: PaginationType = {
        limit: 4,
        offset: 1,
        search: 'a',
        status: TaskStatus.OPEN
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: DataSource, useValue: {} },
                { provide: getRepositoryToken(TaskEntity), useValue: createMockRepository() }
            ]
        }).compile();

        taskService = module.get<TasksService>(TasksService);
        taskRespository = module.get<MockRepository>(getRepositoryToken(TaskEntity));
    })

    it('should be defained', () => {
        expect(taskService).toBeDefined();
    })

    describe('findTaskById', () => {
        describe('When successfuly retrived', () => {
            it('should return a task', async () => {
                taskRespository.findOne.mockReturnValue(mockTask);
                const task = await taskService.findTaskById(mockUser, 1);
                expect(task).toBeDefined(),
                    expect(task).toEqual(mockTask);
            })
        })
        describe('Otherwise', () => {
            it('should throw exception', async () => {
                taskRespository.findOne.mockReturnValue(undefined);
                try {
                    const task = await taskService.findTaskById(mockUser, 1);
                    expect(task).toThrow();
                } catch (error) {
                    expect(error).toBeInstanceOf(NotFoundException);
                    expect(error.message).toEqual(`Task with #id: ${1} not found`);
                }
            })
        })
    })
    describe('addTask', () => {
        it('should add task', async () => {
            taskRespository.save.mockReturnValue(mockTask);
            const task = await taskService.addTask(mockUser, mockTaskType);
            expect(task).toBeDefined();
            expect(task).toEqual(mockTask);
        })
    })
    describe('updateTask', () => {
        describe('When a task successfuly updated', () => {
            it('should update the task', async () => {
                taskRespository.findOne.mockReturnValue(mockTask);
                taskRespository.save.mockReturnValue({ ...mockTask, status: TaskStatus.DONE });
                const task = await taskService.updateTask(mockUser, 1, TaskStatus.DONE);
                expect(task).toBeDefined();
                expect(task).toEqual(mockTask);
                expect(task.status).toEqual(TaskStatus.DONE);
            })
        })
        describe('Otherwise', () => {
            it('should throw exception', async () => {
                taskRespository.findOne.mockReturnValue(undefined);
                try {
                    const task = await taskService.updateTask(mockUser, 5, TaskStatus.IN_PROGRESS);
                    expect(task).toThrow();
                } catch (error) {
                    expect(error).toBeInstanceOf(NotFoundException);
                    expect(error.message).toEqual(`Task with #id: ${5} not found`)
                }
            })
        })
    })
    describe('removeTask', () => {
        describe('When a task successfuly removed', () => {
            it('should remove the task', async () => {
                taskRespository.findOne.mockReturnValue(mockTask);
                const task = await taskService.removeTask(mockUser, 1);
                expect(task).toBeUndefined();

            })
        })
        describe('Otherwise', () => {
            it('should throw exception', async () => {
                taskRespository.findOne.mockReturnValue(undefined);
                try {
                    const task = await taskService.removeTask(mockUser, 5);
                    expect(task).toThrow();
                } catch (error) {
                    expect(error).toBeInstanceOf(NotFoundException);
                    expect(error.message).toEqual(`Task with #id: ${5} not found`)
                }
            })
        })
    })
})