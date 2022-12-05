import { TaskStatus } from "@app/tasks/types/task-status.enum";

export interface AddTaskType {
    body: string;
    description: string;
    status?: TaskStatus;
}