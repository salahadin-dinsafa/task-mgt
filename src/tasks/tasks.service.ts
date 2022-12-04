import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";

import { TaskEntity } from "@app/tasks/entities/task.entity";
import { AddTaskType } from "@app/tasks/types/add-task.type";
import { UpdateTaskType } from "@app/tasks/types/update-task.type";
import { PaginationType } from "@app/tasks/types/pagination.type";

@Injectable()
export class TasksService {
    tasks: TaskEntity[] = [];
    id: number = 0;
    findAllTasks(pagination: PaginationType): TaskEntity[] {
        const { limit, offset, status, search } = pagination;
        let tasks: TaskEntity[];
        try {
            tasks = this.tasks;
            tasks = status ?
                tasks.filter(task => task.status === status) :
                tasks;
            tasks = search ?
                tasks.filter(task => task.body.includes(search) || task.description.includes(search)) :
                tasks;
            return tasks.slice(offset, limit);
        } catch (error) {
            console.log(`Error: ${error}`);
            throw new InternalServerErrorException(
                `Internal server error occured: ${error.message}`)
        }
    }
    findTaskById(id: number): TaskEntity {
        let task: TaskEntity;
        try {
            task = this.tasks.find(task => task.id === id)
        } catch (error) {
            console.log(`Error: ${error}`);
            throw new InternalServerErrorException(
                `Internal server error occured: ${error.message}`)
        }
        if (!task) throw new NotFoundException(`Task with #id: ${id} not found`);
        return task;
    }
    addTask(addTask: AddTaskType): TaskEntity {
        try {
            let task: TaskEntity = { ...addTask, id: this.id++ };
            this.tasks.push(task);
            return this.tasks[this.tasks.length - 1];
        } catch (error) {
            console.log(`Error: ${error}`);
            throw new InternalServerErrorException(`Internal server error occured: ${error.message}`)
        }
    }
    updateTask(id: number, updateTask: UpdateTaskType): TaskEntity {
        let task: TaskEntity = this.findTaskById(id);
        try {
            task.status = updateTask.status;
            let currentTaskIndex: number = this.tasks.indexOf(task);
            this.tasks[currentTaskIndex] = task;
            return task;
        } catch (error) {
            console.log(`Error: ${error}`);
            throw new InternalServerErrorException(`Internal server error occured: ${error.message}`)
        }
    }
    removeTask(id: number): void {
        this.findTaskById(id);
        try {
            this.tasks = this.tasks.filter(singleTask => singleTask.id !== id);
            return;
        } catch (error) {
            console.log(`Error: ${error}`);
            throw new InternalServerErrorException(`Internal server error occured: ${error.message}`)
        }
    }
}