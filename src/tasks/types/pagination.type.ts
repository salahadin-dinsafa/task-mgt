import { TaskStatus } from "@app/tasks/types/task-status.enum";

export interface PaginationType {
    limit?: number;
    offset?: number;
    status?: TaskStatus;
    search?: string;
}