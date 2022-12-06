import { TaskStatus } from "../types/task-status.enum";

export interface PaginationType {
    limit?: number;
    offset?: number;
    status?: TaskStatus;
    search?: string;
}