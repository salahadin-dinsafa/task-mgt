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
import { TaskResponseType } from "./types/task-response.type";


@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskEntity)
        private readonly taskRespository: Repository<TaskEntity>,
        private readonly datasource: DataSource,

    ) { }

    async findTaskById(user: UserEntity, id: number): Promise<TaskEntity> {
        let task: TaskEntity;
        try {
            task = await this.taskRespository
                .findOne({ where: { id }, relations: ['author'] })
        } catch (error) {
            throw new InternalServerErrorException(
                `Internal server error occured: ${error.message}`)
        }

        if (!task) throw new NotFoundException(`Task with #id: ${id} not found`);

        if (user.role === Role.ADMIN) return task;

        if (task.author.id === user.id)
            return task;
        else
            throw new NotFoundException(`Task with #id: ${id} not found`);

    }


    async findAllTasks(user: UserEntity, pagination: PaginationType): Promise<TaskResponseType[]> {
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
            return (await queryBuilder.getMany())
                .map(task => this.getTaskResponse(task))
        } catch (error) {
            throw new InternalServerErrorException(
                `Internal server error occured: ${error.message}`)
        }
    }

    async findTask(user: UserEntity, id: number): Promise<TaskResponseType> {
        let task: TaskEntity = await this.findTaskById(user, id);
        return this.getTaskResponse(task);
    }
    async addTask(user: UserEntity, addTask: AddTaskType): Promise<TaskResponseType> {
        try {
            const task: TaskEntity = this.taskRespository.create({
                ...addTask,
                author: user
            });
            return this.getTaskResponse(await task.save());

        } catch (error) {
            throw new InternalServerErrorException(`Internal server error occured: ${error.message}`)
        }
    }
    async updateTask(user: UserEntity, id: number, status: TaskStatus): Promise<TaskResponseType> {
        let task: TaskEntity = await this.findTaskById(user, id);

        task.status = status;
        return this.getTaskResponse(await task.save());

    }
    async removeTask(user: UserEntity, id: number): Promise<void> {
        let task: TaskEntity = await this.findTaskById(user, id);
        try {
            await task.remove();
        } catch (error) {

            throw new InternalServerErrorException(`Internal server error occured: ${error.message}`)
        }
    }

    getTaskResponse(task: TaskEntity): TaskResponseType {
        if (task.author.tasks)
            delete task.author.tasks;
        return {
            ...task,
            author: this.getUserResponse(task.author)
        }
    }

    getUserResponse(user: UserEntity): UserEntity {
        delete user.password;
        if (user.tasks)
            delete user.tasks;
        return user;
    }
}