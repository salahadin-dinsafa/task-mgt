import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '@app/tasks/types/task-status.enum';

export class AddTaskDto {
    @IsNotEmpty()
    @IsString()
    body: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    @IsIn([TaskStatus.DONE, TaskStatus.IN_PROGRESS, TaskStatus.OPEN])
    status: TaskStatus
}