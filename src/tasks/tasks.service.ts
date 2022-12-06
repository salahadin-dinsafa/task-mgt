import {
    Injectable,
    InternalServerErrorException, Logger, NotFoundException
} from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";

import { TaskEntity } from "./entities/task.entity";
import { AddTaskType } from "./types/add-task.type";
import { PaginationType } from "./types/pagination.type";
import { TaskStatus } from "./types/task-status.enum";
import { UserEntity } from "../auth/entities/user.entity";
import { Role } from "../auth/types/role.enum";


@Injectable()
export class TasksService {
    private logger = new Logger('TasksService');
    constructor(
        @InjectRepository(TaskEntity)
        private readonly taskRespository: Repository<TaskEntity>,
        private readonly datasource: DataSource
    ) { }
    async findAllTasks(user: UserEntity, pagination: PaginationType): Promise<TaskEntity[]> {
        const { limit, offset, status, search } = pagination;
        try {
            const queryBuilder = this.datasource
                .getRepository(TaskEntity)
                .createQueryBuilder('tasks')
                .leftJoinAndSelect('tasks.author', 'author');
            user.role === Role.ADMIN ? null :
                queryBuilder.andWhere('author.id = :id', { id: user.id });

            search ?
                queryBuilder.andWhere(
                    `(tasks.title LIKE :search OR tasks.description LIKE :search)`,
                    { search: `%${search}%` }) :
                null;
            status ?
                queryBuilder.andWhere(`tasks.status = :status`, { status }) :
                null;
            limit ?
                queryBuilder.take(limit) :
                queryBuilder.take(10);
            offset ?
                queryBuilder.skip(offset) :
                queryBuilder.skip(0);
            return await queryBuilder.getMany();
        } catch (error) {
            this.logger.error(`Error: ${error.message}`)
            throw new InternalServerErrorException(
                `Internal server error occured: ${error.message}`)
        }
    }
    async findTaskById(user: UserEntity, id: number): Promise<TaskEntity> {
        let task: TaskEntity;
        try {
            task = user.role === Role.ADMIN ?
                await this.taskRespository.findOne({ where: { id } }) :
                user.tasks.find(task => task.id === id);
        } catch (error) {
            this.logger.error(`Error: ${error.message}`)
            throw new InternalServerErrorException(
                `Internal server error occured: ${error.message}`)
        }
        if (!task) throw new NotFoundException(`Task with #id: ${id} not found`);
        return task;
    }
    async addTask(user: UserEntity, addTask: AddTaskType): Promise<TaskEntity> {
        try {
            const task: TaskEntity = this.taskRespository.create({
                ...addTask,
                author: user
            });
            return await this.taskRespository.save(task).then(task => {
                delete task.author;
                return task
            });
        } catch (error) {
            this.logger.error(`Error: ${error.message}`)
            throw new InternalServerErrorException(`Internal server error occured: ${error.message}`)
        }
    }
    async updateTask(user: UserEntity, id: number, status: TaskStatus): Promise<TaskEntity> {
        let task: TaskEntity = await this.findTaskById(user, id);
        try {
            task.status = status;
            return await this.taskRespository.save(task);
        } catch (error) {
            this.logger.error(`Error: ${error.message}`)
            throw new InternalServerErrorException(`Internal server error occured: ${error.message}`)
        }
    }
    async removeTask(user: UserEntity, id: number): Promise<void> {
        let task: TaskEntity = await this.findTaskById(user, id);
        try {
            await this.taskRespository.remove(task);
        } catch (error) {
            this.logger.error(`Error: ${error.message}`)
            throw new InternalServerErrorException(`Internal server error occured: ${error.message}`)
        }
    }
}