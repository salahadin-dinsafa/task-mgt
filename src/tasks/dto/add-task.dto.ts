import { IsIn, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { TaskStatus } from '../types/task-status.enum';

export class AddTaskDto {
    @ApiProperty({
        description: 'Title of the task',
        required: false,
        example: 'task 0'
    })
    @IsOptional()
    @IsString()
    title: string;

    @ApiProperty({
        description: 'Description of the task',
        required: false,
        example: 'task 0 description'
    })
    @IsOptional()
    @IsString()
    description: string;

    @ApiProperty({
        description: 'Status of the task',
        required: false,
        enum: TaskStatus,
        default: TaskStatus.OPEN,
        example: TaskStatus.IN_PROGRESS
    })
    @IsOptional()
    @IsString()
    @IsIn([TaskStatus.DONE, TaskStatus.IN_PROGRESS, TaskStatus.OPEN])
    status: TaskStatus
}