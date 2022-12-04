import { IsIn, IsNotEmpty } from "class-validator";

import { TaskStatus } from "@app/tasks/types/task-status.enum";

export class UpdateTaskDto {
    @IsNotEmpty()
    @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
    status: TaskStatus;
}