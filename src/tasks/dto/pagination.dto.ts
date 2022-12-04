import { IsOptional, IsNumber, Min, IsIn, IsString } from 'class-validator';

import { TaskStatus } from '@app/tasks/types/task-status.enum';

export class PaginationDto {
    @IsOptional()
    @IsNumber()
    @Min(0)
    limit: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    offset: number;

    @IsOptional()
    @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
    status: TaskStatus;

    @IsOptional()
    @IsString()
    search: string;
}