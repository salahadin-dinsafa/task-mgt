import {
    Injectable,
    InternalServerErrorException, NotFoundException
} from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";

import { TaskEntity } from "@app/tasks/entities/task.entity";
import { AddTaskType } from "@app/tasks/types/add-task.type";
import { PaginationType } from "@app/tasks/types/pagination.type";
import { TaskStatus } from "@app/tasks/types/task-status.enum";


@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskEntity)
        private readonly taskRespository: Repository<TaskEntity>,
        private readonly datasource: DataSource
    ) { }
    async findAllTasks(pagination: PaginationType): Promise<TaskEntity[]> {
        const { limit, offset, status, search } = pagination;
        try {
            const queryBuilder =
                this.datasource.getRepository(TaskEntity).createQueryBuilder('tasks');
            search ?
                queryBuilder.andWhere(`(tasks.title LIKE :search OR tasks.description LIKE :search)`,
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
            console.log(`Error: ${error}`);
            throw new InternalServerErrorException(
                `Internal server error occured: ${error.message}`)
        }
    }
    async findTaskById(id: number): Promise<TaskEntity> {
        let task: TaskEntity;
        try {
            task = await this.taskRespository.findOne({ where: { id } })
        } catch (error) {
            console.log(`Error: ${error}`);
            throw new InternalServerErrorException(
                `Internal server error occured: ${error.message}`)
        }
        if (!task) throw new NotFoundException(`Task with #id: ${id} not found`);
        return task;
    }
    async addTask(addTask: AddTaskType): Promise<TaskEntity> {
        try {
            const task: TaskEntity = this.taskRespository.create(addTask);

            return await this.taskRespository.save(task);
        } catch (error) {
            console.log(`Error: ${error}`);
            throw new InternalServerErrorException(`Internal server error occured: ${error.message}`)
        }
    }
    async updateTask(id: number, status: TaskStatus): Promise<TaskEntity> {
        let task: TaskEntity = await this.findTaskById(id);
        try {
            task.status = status;
            return await this.taskRespository.save(task);
        } catch (error) {
            console.log(`Error: ${error}`);
            throw new InternalServerErrorException(`Internal server error occured: ${error.message}`)
        }
    }
    async removeTask(id: number): Promise<void> {
        let task: TaskEntity = await this.findTaskById(id);
        try {
            await this.taskRespository.remove(task);
        } catch (error) {
            console.log(`Error: ${error}`);
            throw new InternalServerErrorException(`Internal server error occured: ${error.message}`)
        }
    }
}