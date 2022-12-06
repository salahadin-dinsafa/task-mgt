import { TaskStatus } from "../types/task-status.enum";

export interface AddTaskType {
    title: string;
    description: string;
    status?: TaskStatus;
}