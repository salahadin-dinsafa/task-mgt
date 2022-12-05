import { TaskStatus } from "@app/tasks/types/task-status.enum";

export interface AddTaskType {
    title: string;
    description: string;
    status?: TaskStatus;
}