import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

import { UserResponse, UserResponseType } from "../../auth/types/user.type";
import { TaskStatus } from "./task-status.enum";

export interface TaskResponseType {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    author: UserResponseType
}

export class TaskResponse {
    @ApiProperty({
        example: 'number'
    })
    id: number;

    @ApiProperty({
        example: 'string'
    })
    title: string;

    @ApiProperty({
        example: 'string'
    })
    description: string;

    @ApiProperty({
        example: TaskStatus.OPEN
    })
    @IsEnum(TaskStatus)
    status: TaskStatus

    @ApiProperty({
        example: {
            id: 'number',
            username: 'string',
            role: 'string'
        }
    })
    author: UserResponse
}

