import { IsOptional, IsNumber, Min, IsIn, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { TaskStatus } from '../types/task-status.enum';

export class PaginationDto {
    @ApiProperty({
        description: 'How many task to retrive at a time',
        default: 10,
        required: false,
        minimum: 0,
        example: 5
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    limit: number;

    @ApiProperty({
        description: 'How many task to skip at a time',
        default: 0,
        required: false,
        minimum: 0,
        example: 1
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    offset: number;

    @ApiProperty({
        description: 'Task status',
        enum: TaskStatus,
        required: false,
        example: TaskStatus.OPEN
    })
    @IsOptional()
    @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
    status: TaskStatus;

    @ApiProperty({
        description: 'Search value of task',
        required: false,
        example: 'a'
    })
    @IsOptional()
    @IsString()
    search: string;
}