import { TaskStatus } from "@app/tasks/types/task-status.enum";

export class TaskEntity {
    id: number;
    body: string;
    description: string;
    status: TaskStatus
}