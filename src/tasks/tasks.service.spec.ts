import { Test, TestingModule } from "@nestjs/testing";

import { getRepositoryToken } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

import { TaskEntity } from "./entities/task.entity";
import { TasksService } from "./tasks.service"

describe('TasksService', () => {
    let taskService: TasksService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: getRepositoryToken(TaskEntity), useValue: {} },
                { provide: DataSource, useValue: {} }
            ]
        }).compile();

        taskService = module.get<TasksService>(TasksService);
    })

    it('should be defained', () => {
        expect(taskService).toBeDefined();
    })
})